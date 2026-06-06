use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

/// Secure Token Program for Solana
/// Implements token operations with access control and supply management
#[program]
pub mod secure_token {
    use super::*;

    /// Initialize a new token with configurable supply
    pub fn initialize(
        ctx: Context<Initialize>,
        total_supply: u64,
        max_supply: u64,
    ) -> Result<()> {
        require!(total_supply > 0, ErrorCode::InvalidAmount);
        require!(max_supply >= total_supply, ErrorCode::InvalidSupplyConfig);
        require!(max_supply > 0, ErrorCode::InvalidSupplyConfig);

        let token = &mut ctx.accounts.token;
        token.authority = ctx.accounts.authority.key();
        token.total_supply = total_supply;
        token.max_supply = max_supply;
        token.mint_authority = ctx.accounts.authority.key();

        emit!(InitializeEvent {
            authority: ctx.accounts.authority.key(),
            total_supply,
            max_supply,
        });

        Ok(())
    }

    /// Transfer tokens with comprehensive validation
    pub fn transfer(ctx: Context<Transfer>, amount: u64) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);
        
        let from = &mut ctx.accounts.from;
        let to = &mut ctx.accounts.to;

        // Prevent self-transfer
        require!(
            from.key() != to.key(),
            ErrorCode::SelfTransferNotAllowed
        );

        // Authority must own the source account
        require!(
            from.owner == ctx.accounts.authority.key(),
            ErrorCode::Unauthorized
        );

        // Sufficient balance check
        require!(
            from.balance >= amount,
            ErrorCode::InsufficientFunds
        );

        // Checks-Effects-Interactions pattern
        from.balance = from.balance
            .checked_sub(amount)
            .ok_or(ErrorCode::ArithmeticError)?;
        to.balance = to.balance
            .checked_add(amount)
            .ok_or(ErrorCode::ArithmeticError)?;

        emit!(TransferEvent {
            from: from.key(),
            to: to.key(),
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Mint new tokens (mint authority only)
    pub fn mint(ctx: Context<Mint>, amount: u64) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);

        let token = &mut ctx.accounts.token;
        let recipient = &mut ctx.accounts.recipient;

        // Only designated mint authority
        require!(
            ctx.accounts.authority.key() == token.mint_authority,
            ErrorCode::Unauthorized
        );

        // Supply cap check
        let new_supply = token
            .total_supply
            .checked_add(amount)
            .ok_or(ErrorCode::ArithmeticError)?;
        require!(new_supply <= token.max_supply, ErrorCode::MaxSupplyExceeded);

        // Update state
        token.total_supply = new_supply;
        recipient.balance = recipient
            .balance
            .checked_add(amount)
            .ok_or(ErrorCode::ArithmeticError)?;

        emit!(MintEvent {
            mint_authority: ctx.accounts.authority.key(),
            recipient: recipient.key(),
            amount,
            new_total_supply: new_supply,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Burn tokens from an account
    pub fn burn(ctx: Context<Burn>, amount: u64) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);

        let account = &mut ctx.accounts.account;
        let token = &mut ctx.accounts.token;

        // Authority must own the account
        require!(
            account.owner == ctx.accounts.authority.key(),
            ErrorCode::Unauthorized
        );

        // Sufficient balance
        require!(
            account.balance >= amount,
            ErrorCode::InsufficientFunds
        );

        // Update state
        account.balance = account
            .balance
            .checked_sub(amount)
            .ok_or(ErrorCode::ArithmeticError)?;
        token.total_supply = token
            .total_supply
            .checked_sub(amount)
            .ok_or(ErrorCode::ArithmeticError)?;

        emit!(BurnEvent {
            burner: ctx.accounts.authority.key(),
            account: account.key(),
            amount,
            new_total_supply: token.total_supply,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Transfer mint authority to a new key
    pub fn transfer_mint_authority(
        ctx: Context<TransferMintAuthority>,
        new_authority: Pubkey,
    ) -> Result<()> {
        require!(
            new_authority != Pubkey::default(),
            ErrorCode::InvalidAuthority
        );
        require!(
            new_authority != ctx.accounts.token.mint_authority,
            ErrorCode::AlreadyAuthorized
        );

        let token = &mut ctx.accounts.token;
        token.mint_authority = new_authority;

        emit!(AuthorityTransferred {
            old_authority: ctx.accounts.authority.key(),
            new_authority,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Update max supply (authority only)
    pub fn update_max_supply(ctx: Context<UpdateMaxSupply>, new_max: u64) -> Result<()> {
        let token = &mut ctx.accounts.token;

        require!(
            new_max >= token.total_supply,
            ErrorCode::InvalidSupplyConfig
        );
        require!(new_max > 0, ErrorCode::InvalidSupplyConfig);

        token.max_supply = new_max;

        emit!(MaxSupplyUpdated {
            authority: ctx.accounts.authority.key(),
            old_max: token.max_supply,
            new_max,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

// ─── Contexts ────────────────────────────────────

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = Token::LEN
    )]
    pub token: Account<'info, Token>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(
        mut,
        constraint = from.owner == authority.key() @ ErrorCode::Unauthorized
    )]
    pub from: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Mint<'info> {
    #[account(
        mut,
        constraint = token.mint_authority == authority.key() @ ErrorCode::Unauthorized
    )]
    pub token: Account<'info, Token>,
    
    #[account(mut)]
    pub recipient: Account<'info, TokenAccount>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Burn<'info> {
    #[account(
        mut,
        constraint = account.owner == authority.key() @ ErrorCode::Unauthorized
    )]
    pub account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub token: Account<'info, Token>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct TransferMintAuthority<'info> {
    #[account(
        mut,
        constraint = token.authority == authority.key() @ ErrorCode::Unauthorized
    )]
    pub token: Account<'info, Token>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateMaxSupply<'info> {
    #[account(
        mut,
        constraint = token.authority == authority.key() @ ErrorCode::Unauthorized
    )]
    pub token: Account<'info, Token>,
    
    pub authority: Signer<'info>,
}

// ─── Accounts ────────────────────────────────────

#[account]
pub struct Token {
    pub authority: Pubkey,       // 32 bytes — program authority
    pub total_supply: u64,       // 8 bytes  — current circulating supply
    pub mint_authority: Pubkey,  // 32 bytes — designated mint authority
    pub max_supply: u64,         // 8 bytes  — absolute supply cap
}

impl Token {
    pub const LEN: usize = 8 + 32 + 8 + 32 + 8; // Anchor discriminator + fields
}

#[account]
pub struct TokenAccount {
    pub owner: Pubkey,  // 32 bytes — account owner
    pub balance: u64,   // 8 bytes  — token balance
}

impl TokenAccount {
    pub const LEN: usize = 8 + 32 + 8; // Anchor discriminator + fields
}

// ─── Events ──────────────────────────────────────

#[event]
pub struct InitializeEvent {
    pub authority: Pubkey,
    pub total_supply: u64,
    pub max_supply: u64,
}

#[event]
pub struct TransferEvent {
    pub from: Pubkey,
    pub to: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct MintEvent {
    pub mint_authority: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub new_total_supply: u64,
    pub timestamp: i64,
}

#[event]
pub struct BurnEvent {
    pub burner: Pubkey,
    pub account: Pubkey,
    pub amount: u64,
    pub new_total_supply: u64,
    pub timestamp: i64,
}

#[event]
pub struct AuthorityTransferred {
    pub old_authority: Pubkey,
    pub new_authority: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct MaxSupplyUpdated {
    pub authority: Pubkey,
    pub old_max: u64,
    pub new_max: u64,
    pub timestamp: i64,
}

// ─── Error Codes ─────────────────────────────────

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient funds for transfer")] 
    InsufficientFunds,
    
    #[msg("Caller is not authorized for this operation")] 
    Unauthorized,
    
    #[msg("Mint would exceed maximum supply cap")] 
    MaxSupplyExceeded,
    
    #[msg("Invalid amount: must be greater than zero")] 
    InvalidAmount,
    
    #[msg("Invalid supply configuration: max must be >= total")] 
    InvalidSupplyConfig,
    
    #[msg("Arithmetic error: overflow or underflow")] 
    ArithmeticError,
    
    #[msg("Self-transfer is not allowed")] 
    SelfTransferNotAllowed,
    
    #[msg("Invalid authority key provided")] 
    InvalidAuthority,
    
    #[msg("Authority is already set to this value")] 
    AlreadyAuthorized,
}