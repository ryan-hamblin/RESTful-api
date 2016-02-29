var mongoose    = require('mongoose');
var express 		= require('express');
var app 				= express();
var bodyParser  = require('body-parser');
var Bear     		= require('./app/models/bear');


mongoose.connect('mongodb://localhost/27017');
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(bodyParser.json());

var port = process.env.PORT || 3046;

var router = express.Router();

// ################# - MIDDLEWARE - ###################### 

router.use(function(req, res, next) {
	console.log('Hit the Middleware!');
	next();
});

// ################# - ROUTES - ######################### 

router.route('/bears')
	.post(function(req, res) {
		var bear = new Bear();
		bear.name = req.body.name;
		bear.save(function(err) {
			if (err)
				res.send(err);
			res.json({ message: 'Bear created!' });
		});	
	})

	.get(function(req, res) {
		Bear.find(function(err, bears) {
			if (err)
				res.send(err);
			res.json(bears);
		});
	});

router.route('/bears/:bear_id')

	.get(function(req,res){
		Bear.findById(req.params.bear_id, function(err, bear){
			if(err) res.send(err);
			res.json(bear)
		});
	})

	.put(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {
			if (err) res.send(err);
			bear.name = req.body.name;
			bear.save(function(err) {
				if (err) res.send(err);
		res.json({ message: 'Bear updated!' });
		});

		});
	})

	.delete(function(req, res){
		Bear.remove({
			_id: req.params.bear_id
		}, function(err, bear){
			if(err) res.send(err);
			res.json({ message: 'Bear was Deleted!' });
		})
	})


router.get('/', function(req, res){
	res.json({ message: 'hooray! Welcome to your new API!' });
});

app.use('/api', router);

app.listen(port);
console.log('Magic happens on PORT: ', port);