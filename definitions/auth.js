let auth = F.module('auth');

auth.options.cookie = '__tfmwj';
auth.options.autoLogin = true;
auth.options.expireSession = 180; // 3 hours
auth.options.expireCookie = 10; // 10 days

F.on('module#auth', function(type, name)
{
    let auth = MODULE('auth');
    // "id" from auth.login()
    auth.onAuthorize = function(id, callback, flags)
    {

        let User = F.model('user').schema;
        User.findOne({_id: id}, function(err, doc)
        {
        	if(err)
        		return;

        	if(!doc)
        	{
        		callback(null);
        		return;
        	}

        	callback(doc);
        });
    };
});