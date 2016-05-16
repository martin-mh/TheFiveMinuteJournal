exports.install = function()
{
	F.route('/', view_index_unlogged, ['unauthorize']);
};

function view_index_unlogged()
{
	let self = this;
	self.view('index');
}

