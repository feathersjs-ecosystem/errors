# @feathersjs/errors

> __Important:__ The code for this module has been moved into the main Feathers repository at [feathersjs/feathers](https://github.com/feathersjs/feathers) ([package direct link](https://github.com/feathersjs/feathers/tree/master/packages/errors)). Please open issues and pull requests there. No changes in your existing Feathers applications are necessary.

[![Build Status](https://travis-ci.org/feathersjs/errors.png?branch=master)](https://travis-ci.org/feathersjs/errors)

> Common error types for feathers apps

## Installation

```
npm install @feathersjs/errors --save
```

Quick usage:

```js
const errors = require('@feathersjs/errors');

// If you were to create an error yourself.
const notFound = new errors.NotFound('User does not exist');

// You can wrap existing errors
const existing = new errors.GeneralError(new Error('I exist'));

// You can also pass additional data
const data = new errors.BadRequest('Invalid email', {
  email: 'sergey@google.com'
});

// You can also pass additional data without a message
const dataWithoutMessage = new errors.BadRequest({
  email: 'sergey@google.com'
});

// If you need to pass multiple errors
const validationErrors = new errors.BadRequest('Invalid Parameters', {
  errors: { email: 'Email already taken' }
});

// You can also omit the error message and we'll put in a default one for you
const validationErrors = new errors.BadRequest({
  errors: {
    email: 'Invalid Email'
  }
});
```

## Documentation

Please refer to the [@feathersjs/errors API documentation](https://docs.feathersjs.com/api/errors.html) for more details.

## License

Copyright (c) 2018 Feathers Contributors

Licensed under the [MIT license](LICENSE).
