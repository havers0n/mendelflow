// Setup Supabase environment variables for Jest tests
process.env.REACT_APP_SUPABASE_URL = 'http://localhost';
process.env.REACT_APP_SUPABASE_ANON_KEY = 'test_key';

// Polyfill TextEncoder/TextDecoder for Node.js tests
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Ensure document.visibilityState is defined to avoid SupabaseAuthClient visibility change errors
if (typeof document !== 'undefined') {
  Object.defineProperty(document, 'visibilityState', {
    value: 'visible',
    configurable: true
  });
} 