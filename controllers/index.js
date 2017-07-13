var model = require('../models/clickme');

var vote = function (req, res, action) {
    var click = {
        //id:req.params.id
    };
    model.updateCounter(click, function (success, result) {
        if (success) res.json({
            status: 'OK'
        });
        else res.json({
            status: 'Error'
        });
    });
}

module.exports = function (app) {
	
    app.get('/', function (req, res) {
        model.getCounter(function (result) {
            res.render('index', {
                clicks: result
            });
        });
    });

    app.put('/counter', function (req, res) {
       vote(req, res, 'counter');
    });

};
