const debug = require('debug')('feathers-errors');

// NOTE (EK): Babel doesn't properly support extending
// some classes in ES6. The Error class being one of them.
// Node v5.0+ does support this but until we want to drop support
// for older versions we need this hack.
// http://stackoverflow.com/questions/33870684/why-doesnt-instanceof-work-on-instances-of-error-subclasses-under-babel-node
// https://github.com/loganfsmyth/babel-plugin-transform-builtin-extend

class FeathersError extends Error {
  constructor (msg, name, code, className, data) {
    msg = msg || 'Error';

    let errors;
    let message;

    if (msg instanceof Error) {
      message = msg.message || 'Error';

      // NOTE (EK): This is typically to handle validation errors
      if (msg.errors) {
        errors = msg.errors;
      }
    } else if (typeof msg === 'object') { // Support plain old objects
      message = msg.message || 'Error';
      data = msg;
    } else { // message is just a string
      message = msg;
    }

    if (data && data.errors) {
      data = Object.assign({}, data);
      errors = data.errors;
      delete data.errors;
    }

    super(message);

    // NOTE (EK): Babel doesn't support this so
    // we have to pass in the class name manually.
    // this.name = this.constructor.name;
    this.type = 'FeathersError';
    this.name = name;
    this.message = message;
    this.code = code;
    this.className = className;
    this.data = data;
    this.errors = errors || {};

    debug(`${this.name}(${this.code}): ${this.message}`);
  }

  // NOTE (EK): A little hack to get around `message` not
  // being included in the default toJSON call.
  toJSON () {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      className: this.className,
      data: this.data,
      errors: this.errors
    };
  }
}

class BadRequest extends FeathersError {
  constructor (message, data) {
    super(message, 'BadRequest', 400, 'bad-request', data);
  }
}

class NotAuthenticated extends FeathersError {
  constructor (message, data) {
    super(message, 'NotAuthenticated', 401, 'not-authenticated', data);
  }
}

class PaymentError extends FeathersError {
  constructor (message, data) {
    super(message, 'PaymentError', 402, 'payment-error', data);
  }
}

class Forbidden extends FeathersError {
  constructor (message, data) {
    super(message, 'Forbidden', 403, 'forbidden', data);
  }
}

class NotFound extends FeathersError {
  constructor (message, data) {
    super(message, 'NotFound', 404, 'not-found', data);
  }
}

class MethodNotAllowed extends FeathersError {
  constructor (message, data) {
    super(message, 'MethodNotAllowed', 405, 'method-not-allowed', data);
  }
}

class NotAcceptable extends FeathersError {
  constructor (message, data) {
    super(message, 'NotAcceptable', 406, 'not-acceptable', data);
  }
}

class Timeout extends FeathersError {
  constructor (message, data) {
    super(message, 'Timeout', 408, 'timeout', data);
  }
}

class Conflict extends FeathersError {
  constructor (message, data) {
    super(message, 'Conflict', 409, 'conflict', data);
  }
}

class LengthRequired extends FeathersError {
  constructor (message, data) {
    super(message, 'LengthRequired', 411, 'length-required', data);
  }
}

class Unprocessable extends FeathersError {
  constructor (message, data) {
    super(message, 'Unprocessable', 422, 'unprocessable', data);
  }
}

class TooManyRequests extends FeathersError {
  constructor (message, data) {
    super(message, 'TooManyRequests', 429, 'too-many-requests', data);
  }
}

class GeneralError extends FeathersError {
  constructor (message, data) {
    super(message, 'GeneralError', 500, 'general-error', data);
  }
}

class NotImplemented extends FeathersError {
  constructor (message, data) {
    super(message, 'NotImplemented', 501, 'not-implemented', data);
  }
}

class BadGateway extends FeathersError {
  constructor (message, data) {
    super(message, 'BadGateway', 502, 'bad-gateway', data);
  }
}

class Unavailable extends FeathersError {
  constructor (message, data) {
    super(message, 'Unavailable', 503, 'unavailable', data);
  }
}

const errors = {
  FeathersError,
  BadRequest,
  NotAuthenticated,
  PaymentError,
  Forbidden,
  NotFound,
  MethodNotAllowed,
  NotAcceptable,
  Timeout,
  Conflict,
  LengthRequired,
  Unprocessable,
  TooManyRequests,
  GeneralError,
  NotImplemented,
  BadGateway,
  Unavailable,
  400: BadRequest,
  401: NotAuthenticated,
  402: PaymentError,
  403: Forbidden,
  404: NotFound,
  405: MethodNotAllowed,
  406: NotAcceptable,
  408: Timeout,
  409: Conflict,
  411: LengthRequired,
  422: Unprocessable,
  429: TooManyRequests,
  500: GeneralError,
  501: NotImplemented,
  502: BadGateway,
  503: Unavailable
};

function convert (error) {
  if (!error) {
    return error;
  }

  const FeathersError = errors[error.name];
  const result = FeathersError ? new FeathersError(error.message, error.data)
    : new Error(error.message || error);

  if (typeof error === 'object') {
    Object.assign(result, error);
  }

  return result;
}

export default Object.assign({
  convert,
  types: errors,
  errors
}, errors);
