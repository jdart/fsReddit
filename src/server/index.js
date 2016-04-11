const serverConfig = require('./config');

if (!process.env.NODE_ENV)
  throw new Error('Environment variable NODE_ENV isn\'t set. Remember it\'s up your production enviroment to set NODE_ENV and maybe other variables.');

require('babel-register');

// To ignore webpack custom loaders on server.
serverConfig.webpackStylesExtensions.forEach(function(ext) {
  require.extensions['.' + ext] = function() {};
});

require('./main');
