'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Beer = mongoose.model('Beer'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, beer;

/**
 * Beer routes tests
 */
describe('Beer CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Beer
		user.save(function() {
			beer = {
				name: 'Beer Name'
			};

			done();
		});
	});

	it('should be able to save Beer instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Beer
				agent.post('/beers')
					.send(beer)
					.expect(200)
					.end(function(beerSaveErr, beerSaveRes) {
						// Handle Beer save error
						if (beerSaveErr) done(beerSaveErr);

						// Get a list of Beers
						agent.get('/beers')
							.end(function(beersGetErr, beersGetRes) {
								// Handle Beer save error
								if (beersGetErr) done(beersGetErr);

								// Get Beers list
								var beers = beersGetRes.body;

								// Set assertions
								(beers[0].user._id).should.equal(userId);
								(beers[0].name).should.match('Beer Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Beer instance if not logged in', function(done) {
		agent.post('/beers')
			.send(beer)
			.expect(401)
			.end(function(beerSaveErr, beerSaveRes) {
				// Call the assertion callback
				done(beerSaveErr);
			});
	});

	it('should not be able to save Beer instance if no name is provided', function(done) {
		// Invalidate name field
		beer.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Beer
				agent.post('/beers')
					.send(beer)
					.expect(400)
					.end(function(beerSaveErr, beerSaveRes) {
						// Set message assertion
						(beerSaveRes.body.message).should.match('Please fill Beer name');
						
						// Handle Beer save error
						done(beerSaveErr);
					});
			});
	});

	it('should be able to update Beer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Beer
				agent.post('/beers')
					.send(beer)
					.expect(200)
					.end(function(beerSaveErr, beerSaveRes) {
						// Handle Beer save error
						if (beerSaveErr) done(beerSaveErr);

						// Update Beer name
						beer.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Beer
						agent.put('/beers/' + beerSaveRes.body._id)
							.send(beer)
							.expect(200)
							.end(function(beerUpdateErr, beerUpdateRes) {
								// Handle Beer update error
								if (beerUpdateErr) done(beerUpdateErr);

								// Set assertions
								(beerUpdateRes.body._id).should.equal(beerSaveRes.body._id);
								(beerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Beers if not signed in', function(done) {
		// Create new Beer model instance
		var beerObj = new Beer(beer);

		// Save the Beer
		beerObj.save(function() {
			// Request Beers
			request(app).get('/beers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Beer if not signed in', function(done) {
		// Create new Beer model instance
		var beerObj = new Beer(beer);

		// Save the Beer
		beerObj.save(function() {
			request(app).get('/beers/' + beerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', beer.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Beer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Beer
				agent.post('/beers')
					.send(beer)
					.expect(200)
					.end(function(beerSaveErr, beerSaveRes) {
						// Handle Beer save error
						if (beerSaveErr) done(beerSaveErr);

						// Delete existing Beer
						agent.delete('/beers/' + beerSaveRes.body._id)
							.send(beer)
							.expect(200)
							.end(function(beerDeleteErr, beerDeleteRes) {
								// Handle Beer error error
								if (beerDeleteErr) done(beerDeleteErr);

								// Set assertions
								(beerDeleteRes.body._id).should.equal(beerSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Beer instance if not signed in', function(done) {
		// Set Beer user 
		beer.user = user;

		// Create new Beer model instance
		var beerObj = new Beer(beer);

		// Save the Beer
		beerObj.save(function() {
			// Try deleting Beer
			request(app).delete('/beers/' + beerObj._id)
			.expect(401)
			.end(function(beerDeleteErr, beerDeleteRes) {
				// Set message assertion
				(beerDeleteRes.body.message).should.match('User is not logged in');

				// Handle Beer error error
				done(beerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Beer.remove().exec();
		done();
	});
});