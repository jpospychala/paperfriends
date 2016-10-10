const pg = require('pg');

var PGQ = function(config) {
    var client = new pg.Client({
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_USER,
        host: 'postgres'
    });

    this.connect = promisify(client, client.connect);
    this.query = promisify(client, client.query);
}

var promisify = function (obj, fn) {
    return function () {
        var argsWithCallback = Array.prototype.slice.call(arguments);
        var promise = new Promise((resolve, reject) => {
            argsWithCallback.push((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
            fn.apply(obj, argsWithCallback);
        });
        return promise;
    };
};

module.exports = PGQ;