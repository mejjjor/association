<login>
<form>
	<div if='{ opts.currentUser == undefined }'>
    <input type="login" name="login" value='{ login }' onchange='{ edit }' placeholder="login">
    <input type="password" name="password" value='{ password }' onchange='{ edit }' placeholder="password">
    <button type="submit" onclick='{ connect }'>Login</button>
    </div>
    <div if='{ opts.currentUser != undefined }'>
    <button type="submit" onclick='{ unConnect }'>Logout</button>
    </div>
</form>
<script>
this.login= ''
this.password = ''
var self = this

edit(e){
	this[e.target.name] = e.target.value
}

connect(e){
	opts.Backendless.UserService.login(this.login, this.password, true, new Backendless.Async(userLoggedIn, gotError))
	self.update()
}

unConnect(e){
	Backendless.UserService.logout( asyncCallback )
    function asyncCallback(){    }
    opts.currentUser = undefined
    self.update()
}

opts.eventBus.on('unConnect',function(){
	self.unConnect('')
	window.scrollTo(0, document.getElementById('title').offsetTop);
})

function userLoggedIn(user) {
	opts.currentUser = user.objectId
    console.log("user has logged in")
    self.update()
    }

    function gotError(err)
    {
        console.log("error message - " + err.message);
        console.log("error code - " + err.statusCode);
    }
   
</script>
</login>