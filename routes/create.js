// Returns an object with handlers for different resources.

/*jslint node: true, maxerr: 50, maxlen: 79, nomen: true, unparam: true */

'use strict';

module.exports = function (env) {
    /*jslint stupid: true */
    var readFileSync = require('fs').readFileSync,
        packageJson = require('../package.json'),
        openWebAppManifestJson =
            require('../views/open-web-app-manifest.json');
    /*jslint stupid: false */

    (function () {
        openWebAppManifestJson.version = packageJson.version;
    }());

    return Object.create(null, {
        index: {value: function (req, res) {
            res.render('index', {
                env: env,
                description: packageJson.description,
                author: packageJson.author,
                repository: packageJson.repository
            });
        }},
        installWebapp: {value: function (req, res) {
            res.render('install-webapp');
        }},
        manifestWebapp: {value: function (req, res) {
            res.set('Content-Type', 'application/x-web-app-manifest+json');
            res.send(JSON.stringify(openWebAppManifestJson));
        }}
    });
};
