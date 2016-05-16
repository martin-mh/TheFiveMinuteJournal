exports.install = function()
{
	F.route('/signin', view_signin);
	F.route('/logout', view_logout, ['authorize']);

	F.route('/setup', view_setup, ['authorize']);

	F.route('/api/register_user', registerUser, ['post']);
	F.route('/api/login_user', loginUser, ['post']);
};

function validateEmail(email)
{
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function encrypt(password)
{
	return password;
}

function view_signin()
{
	let self = this;
	self.view('signin');
}

function registerUser()
{
	let self = this;
	let body = self.body;

	if(!body.firstname
		|| !body.lastname
		|| !body.email
		|| !body.password)
	{
		self.json({success: false, error: 1,
					message: 'Every fields must be filled.'});

		return;
	}

	if(!validateEmail(body.email))
	{
		self.json({success: false,
			error: 2, message: 'You must provide a valid email.'});
		
		return;
	}


	let User = F.model('user').schema;

	User.findOne({ email: body.email }, function(err, doc)
	{
		if(!err)
		{
			if(doc && !!doc)
			{
				self.json({success: false, error: 2, message: 'That email is already taken.'});
				return;
			}
		}

		let newUser = new User;
		newUser.firstName = body.firstname;
		newUser.lastName = body.lastname;
		newUser.email = body.email;
		newUser.password = encrypt(body.password);
		newUser.registerIP = self.ip;
		newUser.lastIP = self.ip;
		newUser.createdAt = new Date();
		newUser.lastConnectedAt = new Date();

		newUser.save(function(err, doc)
		{
			if(!err)
			{
				let auth = F.module('auth');
				auth.login(self, doc._id, doc);
				self.json({success: true});
			}
		});
	});

}

function loginUser()
{
	let self = this;
	let body = self.body;

	if(!body.email || !body.password)
	{
		self.json({success: false, error: 1, message: 'Every fields must be filled.'});
		return;
	}

	if(!validateEmail(body.email))
	{
		self.json({success: false, error: 2, message: 'You must provide a valid email.'})
	}

	let password = encrypt(body.password);

	let User = F.model('user').schema;

	User.findOne({ email: body.email, password: password}, function(err, doc)
	{
		if(err)
			return;

		if(!doc)
		{
			self.json({success: false, error: 3, message: 'Invalid credentials.'});
			return;
		}

		let auth = F.module('auth');
		auth.login(self, doc._id, doc);
		self.json({success: true});
	});
}

function view_logout()
{
	let self = this;
	let auth = F.module('auth');

	auth.logoff(self, self.user._id);
	self.redirect('/', true);
}

function view_setup()
{
	let self = this;
	self.view('setup', self.user);
}