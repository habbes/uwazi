/* eslint-disable */
require('es6-promise').polyfill(); // Required in some browsers

//babel polyfill ES6
require('babel-core/register')();

require.extensions['.scss'] = function () { return; };
require.extensions['.css'] = function () { return; };

var express = require('express');
var path = require('path');
var compression = require('compression');
const app = express();
var http = require('http').Server(app);
var error_handling_middleware = require('./app/api/utils/error_handling_middleware.js');

app.use(error_handling_middleware);
app.use(compression());
app.use(express.static(path.resolve(__dirname, 'dist')));
app.use('/uploaded_documents', express.static(path.resolve(__dirname, 'uploaded_documents')));
app.use('/public', express.static(path.resolve(__dirname, 'public')));
app.use('/flag-images', express.static(path.resolve(__dirname, 'node_modules/react-flags/vendor/flags')));

require('./app/api/api.js')(app, http);
require('./app/react/server.js')(app);
var dbConfig = require('./app/api/config/database');
var translations = require('./app/api/i18n/translations.js');
var systemKeys = require('./app/api/i18n/systemKeys.js');
var ports = require('./app/api/config/ports.js');
const port = ports[app.get('env')];

var mongoose = require('mongoose');
mongoose.Promise = Promise;

mongoose.connect(dbConfig[app.get('env')]);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  translations.processSystemKeys(systemKeys)
  .then(function() {
    http.listen(port, '0.0.0.0', function onStart(err) {
      if (err) {
        console.log(err);
      }
      console.info('==> 🌎 Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
    });
  })
  .catch(console.log);
});
