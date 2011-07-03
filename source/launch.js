enyo.kind({

name:					"PwdHashAppLaunch",
kind:					enyo.Component,

/* Activates an existing card or opens a new card */
openCard: function(type, params)
{
	var base	= enyo.fetchAppRootPath() + "/";
	var path	= "window/index.html";

	return(enyo.windows.activate(base + path, type, params));
},

launch: function(params)
{
	this.openCard("main", params || {});
}

});

