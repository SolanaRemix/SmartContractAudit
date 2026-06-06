class JsonLogger {
  constructor(component = 'app', stream = process.stdout, errorStream = process.stderr) {
    this.component = component;
    this.stream = stream;
    this.errorStream = errorStream;
  }

  _write(level, message, meta = {}) {
    const line = JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      component: this.component,
      message,
      ...meta
    });

    if (level === 'error' || level === 'warn') {
      this.errorStream.write(`${line}\n`);
      return;
    }

    this.stream.write(`${line}\n`);
  }

  info(message, meta) {
    this._write('info', message, meta);
  }

  warn(message, meta) {
    this._write('warn', message, meta);
  }

  error(message, meta) {
    this._write('error', message, meta);
  }
}

module.exports = { JsonLogger };
