exports.install = function()
{
	F.route('/signin', view_signin);
	F.route('/api/register_user', registerUser, ['post']);
		F.route('/', view_index_logged, ['authorize']);
};

function view_index_logged()
{
	let self = this;
	let auth = F.module('auth');
	self.plain('You are logged as {0}.'.format(self.user.email));
}

function validateEmail(email)
{
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
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
		self.json({success: false, error: '1',
					message: 'Every fields must be filled.'});

		return;
	}

	if(!validateEmail(body.email))
	{
		self.json({success: false,
			error: '2', message: 'Your email must be valid'});
		
		return;
	}


	let User = F.model('user').schema;

	User.findOne({ email: body.email }, function(err, doc)
	{
		if(!err)
		{
			if(doc && !!doc)
			{
				self.json({success: false, error: '2', message: 'That email is already taken.'});
				return;
			}
		}

		let newUser = new User;
		newUser.firstName = body.firstname;
		newUser.lastName = body.lastname;
		newUser.email = body.email;
		newUser.password = body.password;
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
				console.log(auth);
				self.json({success: true});
			}
		});
	});

}