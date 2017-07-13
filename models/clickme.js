var model = module.exports;
var r = require('rethinkdb');
var config = require('../config');

var CLICKME_TABLE = 'clickme';

model.setup = function (callback) {
    console.log("Setting up RethinkDB...");
    
    r.connect(config.database).then(function(conn) {
        // Does the database exist?
        r.dbCreate(config.database.db).run(conn).then(function(result) {
            console.log("Database created...");
        }).error(function(error) {
            console.log("Database already created...");
        }).finally(function() {
            // Does the table exist?
            r.table(CLICKME_TABLE).limit(1).run(conn, function(error, cursor) {
                var promise;
                if (error) {
                    console.log("Creating table...");
                    promise = r.tableCreate(CLICKME_TABLE).run(conn);
					
					promise.then(function(result) {
						r.table(CLICKME_TABLE).insert({ "counter": 0 }).run(conn);
					}).error(function(error) {
						throw error;
					});
                } else {    
                    promise = cursor.toArray();
                }

                // The table exists, setup the update listener
                promise.then(function(result) {
                    console.log("Setting up update listener...");
                    r.table(CLICKME_TABLE).changes().run(conn).then(function(cursor) {
                        cursor.each(function(error, row) {
                            callback(row);
                        });
                    });
                }).error(function(error) {
                    throw error;
                });
            });
        });
    }).error(function(error) {
        throw error;
    });
}

model.getCounter = function (callback) {
    r.connect(config.database).then(function(conn) {
        r.table(CLICKME_TABLE).run(conn).then(function(cursor) {
            cursor.toArray(function(error, results) {
                if (error) throw error;
                callback(results);
            });
        }).error(function(error) {
            throw error;
        });
    }).error(function(error) {
        throw error;
    });
}

model.updateCounter = function (click, callback) {
    r.connect(config.database).then(function(conn) {
        r.table(CLICKME_TABLE).update(function(click) {
            return r.object("counter", click("counter").add(1)); 
        }).run(conn).then(function(results) {
           callback(true, results);
        }).error(function(error) {
            callback(false, error);
        });
    }).error(function(error) {
        callback(false, error);
    });
}

