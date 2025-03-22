// Logger utility for development mode
class Logger {
  constructor() {
    // Force dev mode to be true for debugging purposes
    this.isDevMode = true; // Always enable for now
    this.logLevel = 'debug'; // Always use debug level for now
    
    // Original configuration (commented out for now)
    // this.isDevMode = process.env.REACT_APP_DEV_MODE === 'true';
    // this.logLevel = process.env.REACT_APP_LOG_LEVEL || 'info';
    
    console.log('🔧 Logger initialized with:', {
      isDevMode: this.isDevMode,
      logLevel: this.logLevel,
      processEnvDEV: process.env.REACT_APP_DEV_MODE,
      processEnvLOG: process.env.REACT_APP_LOG_LEVEL
    });
    
    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
  }

  // Check if current log level should be shown
  shouldLog(level) {
    return this.isDevMode && this.levels[level] >= this.levels[this.logLevel];
  }

  // Format message with timestamp and extra data
  formatMessage(message, extraData) {
    const timestamp = new Date().toISOString();
    let formattedMessage = `[${timestamp}] ${message}`;
    
    if (extraData) {
      try {
        const extraDataString = typeof extraData === 'object' 
          ? JSON.stringify(extraData, null, 2)
          : extraData;
        formattedMessage += `\n${extraDataString}`;
      } catch (e) {
        formattedMessage += `\n[Unable to stringify extra data]`;
      }
    }
    
    return formattedMessage;
  }

  debug(message, extraData) {
    if (this.shouldLog('debug')) {
      console.debug(`%c[DEBUG] ${this.formatMessage(message, extraData)}`, 'color: #6c757d');
    }
  }

  info(message, extraData) {
    if (this.shouldLog('info')) {
      console.info(`%c[INFO] ${this.formatMessage(message, extraData)}`, 'color: #17a2b8');
    }
  }

  warn(message, extraData) {
    if (this.shouldLog('warn')) {
      console.warn(`%c[WARN] ${this.formatMessage(message, extraData)}`, 'color: #ffc107');
    }
  }

  error(message, extraData) {
    if (this.shouldLog('error')) {
      console.error(`%c[ERROR] ${this.formatMessage(message, extraData)}`, 'color: #dc3545');
    }
  }

  // Log HTTP requests
  request(method, url, data) {
    // Always log requests with detailed info
    console.group(`%c🌐 API Request: ${method} ${url}`, 'color: #6610f2; font-weight: bold');
    console.log('Headers:', { 'Content-Type': 'application/json' });
    console.log('Payload:', data);
    console.groupEnd();
    
    // Also log in standard format if debug is enabled
    if (this.shouldLog('debug')) {
      const requestInfo = {
        method,
        url,
        data: data || null
      };
      console.debug('%c[REQUEST]', 'color: #6610f2', this.formatMessage(`${method} ${url}`, requestInfo));
    }
  }

  // Log HTTP responses
  response(method, url, status, data) {
    if (this.shouldLog('debug')) {
      const color = status >= 400 ? '#dc3545' : '#28a745';
      const responseInfo = {
        method,
        url,
        status,
        data: data || null
      };
      console.debug(`%c[RESPONSE ${status}]`, `color: ${color}`, this.formatMessage(`${method} ${url}`, responseInfo));
    }
  }

  // Log component lifecycle events
  component(componentName, event, props) {
    if (this.shouldLog('debug')) {
      console.debug(`%c[COMPONENT] ${this.formatMessage(`${componentName} - ${event}`, props)}`, 'color: #6f42c1');
    }
  }

  // Log state changes
  state(componentName, stateName, prevValue, newValue) {
    if (this.shouldLog('debug')) {
      const stateInfo = {
        from: prevValue,
        to: newValue
      };
      console.debug(`%c[STATE] ${this.formatMessage(`${componentName} - ${stateName} changed`, stateInfo)}`, 'color: #fd7e14');
    }
  }

  // Log user actions
  action(actionName, details) {
    if (this.shouldLog('info')) {
      console.info(`%c[ACTION] ${this.formatMessage(actionName, details)}`, 'color: #20c997');
    }
  }

  // Log performance metrics
  performance(operation, durationMs) {
    if (this.shouldLog('debug')) {
      console.debug(`%c[PERF] ${this.formatMessage(`${operation} took ${durationMs}ms`)}`, 'color: #e83e8c');
    }
  }
}

// Create singleton
const logger = new Logger();
export default logger;