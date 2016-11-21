require('es6-promise').polyfill();
require('isomorphic-fetch');
var context = require.context('./app/react', true, /\.integration\.js$/); //make sure you have your directory and regex test set correctly!
context.keys().forEach(context)
