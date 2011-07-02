/*
	Copyright (c) 2010, Micah N Gorrell
	All rights reserved.

	THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR IMPLIED
	WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
	MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
	EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
	PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
	OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
	WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
	OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
	ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// TODO	Allow launching with a URI

// TODO	Show the license needed in the about page somewhere

// TODO	Show info about PwdHash

// TODO	Allow other apps to call this as using enyo.CrossAppUI?


enyo.kind(
{

name:													"net.minego.pwdhash",
kind:													enyo.VFlexBox,

components: [
	{
		kind:											"ApplicationEvents",
		onWindowActivated:								"activated",
		onWindowDeactivated:							"deactivated",
		onWindowShown:									"activated",
		onWindowHidden:									"deactivated",
		onOpenAppMenu:									"openAppMenu",
		onCloseAppMenu:									"closeAppMenu"
	},

	{
		name:											"AppMenu",
		kind:											"AppMenu",
		onBeforeOpen:									"beforeMenu"
	},

	{
		kind:											"SlidingPane",
		flex:											1,
		components: [
			{
				name:									"list",
				width:									"320px",

				components: [
					{
						kind:							enyo.Header,
						width:							"100%",
						components: [{
							kind:						enyo.VFlexBox,
							flex:						1,
							align:						"center",
							components: [{
								content:				$L("Recent Domains")
							}]
						}]
					},
					{
						name:							"searchBox",
						className:						"enyo-box-input",
						kind:							enyo.SearchInput,
						hint:							$L("Search"),

						onchange:						"doSearch",
						onCancel:						"doSearch",
						changeOnInput:					true
					},

					{
						kind:							enyo.FadeScroller,
						horizontal:						false,
						name:							"domains",
						flex:							1
// TODO	Fill out a list of recent domains, and allow the user to reorder them
//		or to swipe to delete

// TODO	At launch time look for a domain in the launch parameters and add it to
//		the list, and select it by default

// TODO	Show a "Add Domain" item, and selected it by default.  If there is a
//		value in the clipboard that looks like it might be a domain or URI then
//		fill out the domain by default with that value
					}
				]
			},

			{
				name:									"details",
				flex:									1,
				align:									"center",

// TODO	Add a timer to clear the password from the clipboard

				components: [{
					kind:								enyo.VFlexBox,
					align:								"center",

					components: [
						{
							kind:						enyo.Header,
							width:						"100%",
							components: [{
								kind:					enyo.VFlexBox,
								flex:					1,
								align:					"center",
								components: [{
									content:			$L("Generate Password")
								}]
							}]
						},
						{
							kind:						enyo.Control,
							style:						"margin: 23px auto 0; width: 85%;",

							components: [
								{
									kind:				enyo.RowGroup,
									caption:			$L("Domain"),
									components: [{
										name:			"domain",
										kind:			enyo.Input,
										hint:			$L("Site Address"),

										autocorrect:	false,
										inputType:		"url",
										changeOnInput:	true,
										selectAllOnFocus:
														true,
										autoCapitalize:	"lowercase",
										onchange:		"change"
									}]
								},
								{
									kind:				enyo.RowGroup,
									caption:			$L("Master Password"),
									components: [{
										name:			"password",
										kind:			enyo.PasswordInput,
										hint:			$L("Password"),

										autocorrect:	false,
										changeOnInput:	true,
										selectAllOnFocus:
														true,
										onchange:		"change"
									}]
								},

								{
									kind:				enyo.RowGroup,
									caption:			$L("Generated Password"),
									components: [
										{
											name:		"generated",
											kind:		enyo.Control,
											content:	"<br/>"
										}
									]
								},

								{
									kind:				enyo.Button,
									caption:			$L("Copy Password"),
									name:				"copy",
									onclick:			"copy"
								},

								{
									kind:				enyo.Button,
									caption:			$L("Reset Details"),
									name:				"reset",
									onclick:			"reset"
								},

								{
									kind:				enyo.Button,
									caption:			$L("Launch Browser"),
									name:				"open",
									onclick:			"open"
								}
							]
						}
					]
				}]
			}
		]
	}
],

create: function()
{
	this.value = null;

	this.inherited(arguments);

	enyo.keyboard.setResizesWindow(true);

	// TODO	Move this to an onactive callback?
	/*
		Set the domain to whatever is in the clipboard by default assuming that
		a user has just copied a url.
	*/
	enyo.dom.getClipboard(enyo.bind(this, function(value)
	{
		this.$.domain.setValue(value);
		this.change();
	}));
},

rendered: function()
{
	this.inherited(arguments);

	this.$.domain.forceFocusEnableKeyboard();
	this.change();
},

beforeMenu: function(sender, e)
{
	// TODO	Update the menu
	sender.render();
},

openAppMenu: function(sender, e)
{
	this.$.AppMenu.open();
},

closeAppMenu: function()
{
	this.$.AppMenu.close();
},

change: function()
{
	var uri		= this.$.domain.getValue();
	var pass	= this.$.password.getValue();
	var domain;

	if (uri.length > 0 && pass.length > 0) {
		domain = (new SPH_DomainExtractor()).extractDomain(uri);
		this.value = new String(new SPH_HashedPassword(pass, domain.toLowerCase()));
	} else {
		this.value = null;
	}

	if (this.value) {
		this.$.generated.setAllowHtml(false);
		this.$.generated.setContent(this.value);
	} else {
		this.$.generated.setAllowHtml(true);
		this.$.generated.setContent('<br />');
	}

	this.$.open.setDisabled(uri.length == 0);
	this.$.reset.setDisabled(pass.length == 0 && uri.length == 0);
	this.$.copy.setDisabled(!this.value);
},

copy: function()
{
	enyo.dom.setClipboard(this.value);
	enyo.windows.addBannerMessage($L("Password Copied"), "{}");
},

reset: function()
{
	this.$.domain.setValue('');
	this.$.password.setValue('');

	this.$.generated.setAllowHtml(true);
	this.$.generated.setContent('<br />');

	this.change();
}


});

