exports.install = function()
{
	F.route('/', view_index);
	F.route('/signin', view_signin);
};

function view_index()
{
	let self = this;
	self.view('index');
}

function view_signin()
{
	let self = this;
	self.view('signin');
	framework.log('heyyy');
}