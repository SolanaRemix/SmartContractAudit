use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

/// Example Solana Token Program
/// This is a secure token implementation following best practices
#[program]
pub mod secure_token {
    use super::*;

    /// Initialize a new token
    pub fn initialize(ctx: Context<Initialize>, total_supply: u64) -> Result<()> {
        let token = &mut ctx.accounts.token;
        token.authority = ctx.accounts.authority.key();
        token.total_supply = total_supply;
        token.mint_authority = ctx.accounts.authority.key();
        Ok(())
    }

    /// Transfer tokens with proper checks
    pub fn transfer(ctx: Context<Transfer>, amount: u64) -> Result<()> {
        let from = &mut ctx.accounts.from;
        let to = &mut ctx.accounts.to;

        // Check: Sufficient balance
        require!(from.balance >= amount, ErrorCode::InsufficientFunds);

        // Effects: Update balances
        from.balance = from.balance.checked_sub(amount).unwrap();
        to.balance = to.balance.checked_add(amount).unwrap();

        // Interactions: Emit event
        emit!(TransferEvent {
            from: from.key(),
            to: to.key(),
            amount,
        });

        Ok(())
    }

    /// Mint new tokens (only authority)
    pub fn mint(ctx: Context<Mint>, amount: u64) -> Result<()> {
        let token = &mut ctx.accounts.token;
        let recipient = &mut ctx.accounts.recipient;

        // Check: Only mint authority can mint
        require!(
            ctx.accounts.authority.key() == token.mint_authority,
            ErrorCode::Unauthorized
        );

        // Check: Don't exceed max supply
        let new_supply = token.total_supply.checked_add(amount).unwrap();
        require!(new_supply <= token.max_supply, ErrorCode::MaxSupplyExceeded);

        // Effects: Update state
        token.total_supply = new_supply;
        recipient.balance = recipient.balance.checked_add(amount).unwrap();

        Ok(())
    }

    /// Burn tokens
    pub fn burn(ctx: Context<Burn>, amount: u64) -> Result<()> {
        let account = &mut ctx.accounts.account;
        let token = &mut ctx.accounts.token;

        // Check: Sufficient balance
        require!(account.balance >= amount, ErrorCode::InsufficientFunds);

        // Effects: Update state
        account.balance = account.balance.checked_sub(amount).unwrap();
        token.total_supply = token.total_supply.checked_sub(amount).unwrap();

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8 + 32 + 8)]
    pub token: Account<'info, Token>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Mint<'info> {
    #[account(mut)]
    pub token: Account<'info, Token>,
    #[account(mut)]
    pub recipient: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Burn<'info> {
    #[account(mut)]
    pub account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub token: Account<'info, Token>,
    pub authority: Signer<'info>,
}

#[account]
pub struct Token {
    pub authority: Pubkey,
    pub total_supply: u64,
    pub mint_authority: Pubkey,
    pub max_supply: u64,
}

#[account]
pub struct TokenAccount {
    pub owner: Pubkey,
    pub balance: u64,
}

#[event]
pub struct TransferEvent {
    pub from: Pubkey,
    pub to: Pubkey,
    pub amount: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient funds")]
    InsufficientFunds,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Max supply exceeded")]
    MaxSupplyExceeded,
}
