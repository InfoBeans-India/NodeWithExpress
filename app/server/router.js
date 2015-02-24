
var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');

module.exports = function (app) {
	
	// main login page //
	
	app.get('/', function (req, res) {
		// check if the user's credentials are saved in a cookie //
		if (req.cookies.user == undefined || req.cookies.pass == undefined) {
			res.render('login', { title: 'CP-Wall - Please Login To Your Account' });
		} else {
			// attempt automatic login //
			AM.autoLogin(req.cookies.user, req.cookies.pass, function (o) {
				if (o != null) {
					req.session.user = o;
					res.redirect('/user/' + req.cookies.user);
				} else {
					res.render('login', { title: 'CP-Wall - Please Login To Your Account' });
				}
			});
		}
	});
	
	app.post('/', function (req, res) {
		AM.manualLogin(req.param('user'), req.param('pass'), function (e, o) {
			if (!o) {
				res.send(e, 400);
			} else {
				req.session.user = o;
				res.cookie('user', o.user, { maxAge: 900000 });
				res.cookie('pass', o.pass, { maxAge: 900000 });
				
				res.send(o, 200);
				console.log('user login and redirecting to home');
			}
		});
	});
	
	//user wall page
	
	app.get('/user/:username', function (req, res) {
		
		if (req.session.user == null) {
			
			res.redirect('/');

		} else {
			var uName = req.param('username');
			
			AM.getAllRecords(function (e, accounts) {
				AM.getUserByUname(uName, function (e, onWQallOfuser) {
					
					AM.getPostsForUser(onWQallOfuser, function (e, userPosts) {
						var uPosts = [];
						uPosts = userPosts;
						res.render('index', {
							title : 'Welcome to CP-Wall',
							udata : req.session.user,
							wallUserData: onWQallOfuser,
							accounts: accounts,
							userPosts: uPosts
						});
					});
				});
			});
		}
	});
	
	
	app.post('/logoutuser', function (req, res) {
		if (req.param('logout') == 'true') {
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function (e) { res.send('ok', 200); });
		}
	});
	
	// index page
	app.get('/index', function (req, res) {
		if (req.session.user == null) {
			// if user is not logged-in redirect back to login page //
			res.redirect('/');
		} else {
			
			var uPosts = null;
			
			AM.getAllPosts(function (e, userPosts) {
				uPosts = userPosts;
			});
			
			
			AM.getAllRecords(function (e, accounts) {
				
				res.render('index', {
					title : 'Welcome to CP wall',
					udata : req.session.user,
					accounts: accounts,
					userPosts: uPosts
				});
			});
		}
	});
	
	// logged-in user homepage //    
	
	app.get('/home', function (req, res) {
		if (req.session.user == null) {
			// if user is not logged-in redirect back to login page //
			res.redirect('/');
		} else {
			
			res.render('home', {
				title : 'Control Panel',
				countries : CT,
				udata : req.session.user
			});
		}
	});
	
	app.post('/home', function (req, res) {
		if (req.param('user') != undefined) {
			AM.updateAccount({
				user 		: req.param('user'),
				name 		: req.param('name'),
				email 		: req.param('email'),
				country 	: req.param('country'),
				pass		: req.param('pass')
			}, function (e, o) {
				if (e) {
					res.send('error-updating-account', 400);
				} else {
					req.session.user = o;
					// update the user's login cookies if they exists //
					if (req.cookies.user != undefined && req.cookies.pass != undefined) {
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });
					}
					res.send('ok', 200);
				}
			});
		} else if (req.param('logout') == 'true') {
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function (e) { res.send('ok', 200); });
		}
	});
	
	// creating new accounts //
	
	app.get('/signup', function (req, res) {
		res.render('signup', { title: 'Signup', countries : CT });
	});
	
	app.post('/signup', function (req, res) {
		AM.addNewAccount({
			name 	: req.param('name'),
			email 	: req.param('email'),
			phone 	: req.param('phone'),
			user 	: req.param('user'),
			pass	: req.param('pass'),
			country : req.param('country')
		}, function (e) {
			if (e) {
				res.send(e, 400);
			} else {
				res.send('ok', 200);
			}
		});
	});
	
	// password reset //
	
	app.post('/lost-password', function (req, res) {
		// look up the user's account via their email //
		AM.getAccountByEmail(req.param('email'), function (o) {
			if (o) {
				res.send('ok', 200);
				EM.dispatchResetPasswordLink(o, function (e, m) {
					// this callback takes a moment to return //
					// should add an ajax loader to give user feedback //
					if (!e) {					
					} else {
						res.send('email-server-error', 400);
						for (k in e) console.log('error : ', k, e[k]);
					}
				});
			} else {
				res.send('email-not-found', 400);
			}
		});
	});
	
	app.get('/reset-password', function (req, res) {
		var email = req.query["e"];
		var passH = req.query["p"];
		AM.validateResetLink(email, passH, function (e) {
			if (e != 'ok') {
				res.redirect('/');
			} else {
				// save the user's email in a session instead of sending to the client //
				req.session.reset = { email: email, passHash: passH };
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});
	
	app.post('/reset-password', function (req, res) {
		var nPass = req.param('pass');
		// retrieve the user's email from the session to lookup their account and reset password //
		var email = req.session.reset.email;
		// destory the session immediately after retrieving the stored email //
		req.session.destroy();
		AM.updatePassword(email, nPass, function (e, o) {
			if (o) {
				res.send('ok', 200);
			} else {
				res.send('unable to update password', 400);
			}
		})
	});
	
	// view & delete accounts //
	app.get('/Acounts', function (req, res) {
		AM.getAllRecords(function (e, accounts) {
			
			res.send({ title : 'Account List', accts : accounts }, 200);
		})
	});
	
	app.get('/print', function (req, res) {
		AM.getAllRecords(function (e, accounts) {
			res.render('print', { title : 'Account List', accts : accounts });
		})
	});
	
	app.post('/userPost', function (req, res) {
		console.log('user posted something');
		
		AM.addNewPost({
			postedTo 	: req.param('postedTo'),
			postedToName 	: req.param('postedToName'),
			postedBy 	: req.param('postedBy'),
			postedByName 	: req.param('postedByName'),
			postData 	: req.param('postData')
		}, function (e, postAdded) {
			if (e) {
				res.send(e, 400);
			} else {
				res.send(postAdded, 200);
			}
		});
	});
	
	//userPost
	
	app.post('/delete', function (req, res) {
		AM.deleteAccount(req.body.id, function (e, obj) {
			if (!e) {
				res.clearCookie('user');
				res.clearCookie('pass');
				req.session.destroy(function (e) { res.send('ok', 200); });
			} else {
				res.send('record not found', 400);
			}
		});
	});
	
	app.get('/reset', function (req, res) {
		AM.delAllRecords(function () {
			res.redirect('/print');
		});
	});
	
	
	
	// post like
	app.post('/userLike', function (req, res) {
		console.log('user like something');
		AM.addLike({
			byuserId: req.param('byuserId'),
			postId: req.param('postId'),
		}, function (e) {
			if (e) {
				res.send(e, 400);
			} else {
				res.send('ok', 200);
			}
		});
	});
	
	//count likes
	app.post('/countLikes', function (req, res) {
		AM.countLikes({
			postId: req.param('postId'),
		}, function (e, result) {
			if (e) {
				res.send(e, 400);
			} else {
				res.send(result.length, 200);
			}
		});
	});
	
	
	
	app.get('/post/:postID', function (req, res) {
		
		if (req.session.user == null) {
			
			res.redirect('/');

		} else {
			var postID = req.param('postID');
			
			AM.getPostDataComposite(postID, function (e, postDataComposite) {
				if (!e) {
					var uPosts = postDataComposite;
				}
			});
		}
	});
	
	app.get('*', function (req, res) { res.render('404', { title: 'Page Not Found' }); });

};