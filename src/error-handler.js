// jshint unused:false
import path from 'path';
import errors from './index';

export default function(app) {
  return function(error, req, res, next) {
    if ( !(error instanceof errors.FeathersError) ) {
      let oldError = error;
      error = new errors.GeneralError(oldError.message, {errors: oldError.errors});

      if (oldError.stack) {
        error.stack = oldError.stack;
      }
    }

    const code = !isNaN( parseInt(error.code, 10) ) ? parseInt(error.code, 10) : 500;

    // Don't show stack trace if it is a 404 error
    if (code === 404) {
      error.stack = null;
    }

    res.status(code);

    res.format({
      'text/html': function() {
        const file = code === 404 ? '404.html' : '500.html';

        // If we have a public directory configured then send
        // the file otherwise just respond with the error code
        if (app.get('public')) {
          res.sendFile(path.join(app.get('public'), file));
        }
        else {
          res.send(error);
        }
      },

      'application/json': function () {
        let output = Object.assign({}, error.toJSON());

        if (app.settings.env === 'production') {
          delete output.stack;
        }

        res.json(output);
      }
    });
  };
}
