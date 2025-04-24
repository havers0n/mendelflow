const JsdomEnvironment = require('jest-environment-jsdom');

class CustomJSDOMEnvironment extends JsdomEnvironment {
  constructor(config, context) {
    // Ensure testEnvironmentOptions exists with default html
    config.testEnvironmentOptions = config.testEnvironmentOptions || {};
    config.testEnvironmentOptions.html = config.testEnvironmentOptions.html || '<!DOCTYPE html><html><head></head><body></body></html>';
    super(config, context);
  }
}

module.exports = CustomJSDOMEnvironment; 