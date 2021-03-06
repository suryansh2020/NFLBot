"use strict";
const https = require('https');
const querystring = require('querystring');

module.exports = {
    rootPath: '/indexes/{operation}/docs?api-version=2015-02-28&api-key=A1E4623A5329B55605CDE0380822AE57&search={search}&$top={top}',

    getPath: function(operation, search, top) {
        return this.rootPath.replace('{operation}', operation).replace('{search}', querystring.escape(search)).replace('{top}', top);
    },

    getPlayers: function(playerName, callback) {
        this.loadData(this.getPath('tagscoreplayer', playerName, 5), (playerResults) => {
            callback(playerResults.value);
        });
    },

    getPosition: function(position, callback) {
        this.loadData(this.getPath('position', position, 1), (result) => {
            if(result.value.length == 0) callback(null);
            else(callback(result.value[0]));
        });
    },

    loadData: function (path, callback) {
        var options = {
            host: 'nflbot.search.windows.net',
            port: 443,
            path: path,
            method: 'GET'
        };
        var request = https.request(options, function (response) {
            var data = '';
            response.on('data', function (chunk) { data += chunk; });
            response.on('end', function () {
                callback(JSON.parse(data));
            });
        });
        request.end();
    },
}