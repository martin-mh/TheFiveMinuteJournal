exports.install = function()
{
	F.route('/', view_index_unlogged, ['unauthorize']);
	F.route('/', view_index_logged, ['authorize']);
};

function view_index_unlogged()
{
	let self = this;
	self.view('index');
}

function view_index_logged()
{
	let self = this;
	let auth = F.module('auth');
	self.plain('You are logged as {0}.'.format(self.user.email));
}
