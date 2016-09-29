var riot = require('riot')
var Backendless = require('backendless')
var addAsso = require('./addAsso.tag')
var addAsso = require('./showAssos.tag')
var addAsso = require('./login.tag')
var APP_ID = "FFDC7C5B-9461-2230-FF25-390A64FE4400";
var SECRET_KEY = "0DBD0BF2-7A45-1048-FFA7-B88507C8BF00";
var VERSION = "v1";
var eventBus
var domReady = function(callback) {
    document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};
domReady(function() {
    Backendless.initApp(APP_ID, SECRET_KEY, VERSION);
    Backendless.enablePromises()
    eventBus = riot.observable()
    var currentUser = Backendless.UserService.loggedInUser()
    riot.mount('*', {
        eventBus: eventBus,
        Backendless: Backendless,
        currentUser: currentUser
    })
});