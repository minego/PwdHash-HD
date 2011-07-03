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

// TODO	Use a dashboard to show "Password Copied.  Tap to clear."

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
		kind:											enyo.AppMenu,

		components: [
		]
	},

	{
		name:											"dashboard",
		kind:											enyo.Dashboard,
		onTap:											"clear",
		onUserClose:									"clear"
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

						onchange:						"searchDomain",
						onCancel:						"searchDomain",
						changeOnInput:					true
					},

					{
						kind:							enyo.FadeScroller,
						horizontal:						false,
						flex:							1,

						components: [{
							name:						"domains",
							kind:						enyo.VirtualList,
							onSetupRow:					"setupDomain",

							components: [{
								onclick:				"selectDomain",
								onConfirm:				"deleteDomain",

								name:					"item",
								kind:					enyo.SwipeableItem,
								className:				"toaster-item",
								layoutKind:				"VFlexLayout",
								pack:					"center",
								tapHighlight:			true,
								components: [
									{
										name:			"title",
										className:		"url-item-title enyo-text-ellipsis"
									},
									{
										name:			"url",
										className:		"url-item-url enyo-item-ternary enyo-text-ellipsis"
									}
								]
							}]
                        }]
					}
				]
			},

			{
				name:									"details",
				flex:									1,
				align:									"center",

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
	try {
		this.domains = enyo.json.parse(enyo.getCookie("recentdomains"));
		this.log(this.domains);
	} catch(e) {
		this.domains = [];
	}

	this.inherited(arguments);

	enyo.keyboard.setResizesWindow(true);
},

rendered: function()
{
	this.inherited(arguments);

	this.$.domain.forceFocusEnableKeyboard();
	this.change();
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
	this.clipboardValue = this.value;
	enyo.dom.setClipboard(this.value);

	enyo.windows.addBannerMessage($L("Password Copied"), "{}");
	this.$.dashboard.setLayers([{
		icon:		"lock-small.png",
		title:		"Password Copied",
		text:		"Tap to clear clipboard"
	}]);

	if (-1 == enyo.indexOf(this.$.domain.getValue(), this.domains)) {
		this.domains.push(this.$.domain.getValue());

		/* Save the list */
		enyo.setCookie("recentdomains", enyo.json.stringify(this.domains));
		this.$.domains.refresh();
	}
},

reset: function()
{
	this.$.domain.setValue('');
	this.$.password.setValue('');

	this.$.generated.setAllowHtml(true);
	this.$.generated.setContent('<br />');

	this.change();
},

open: function()
{
	var domain = this.$.domain.getValue();

	if (0 != domain.indexOf("http://")) {
		window.open("http://" + domain);
	} else {
		window.open(domain);
	}
},

// TODO	GRR, setClipboard() doesn't work at all without a body... weird
//
//		Figure out how to do a noWindow app and keep a hidden document around
//		until the dashboard is cleared?
clear: function()
{
	/* An empty string doesn't work, so use a space */
	enyo.dom.setClipboard(" ");

	this.$.dashboard.pop();
	enyo.windows.addBannerMessage($L("Cleared clipboard."), "{}");
},

setupDomain: function(sender, index)
{
	var domain;

	if (!(domain = this.domains[index])) {
		return(false);
	}

	this.$.url.setContent(domain);
	this.$.title.setContent((new SPH_DomainExtractor()).extractDomain(domain));

	if (!this.filter || -1 != domain.toLowerCase().indexOf(this.filter)) {
		this.$.item.setShowing(true);
	} else {
		this.$.item.setShowing(false);
	}

	return(true);
},

selectDomain: function(sender, e, index)
{
	var domain;

	if ((domain = this.domains[index])) {
		this.$.domain.setValue(domain);
		this.change();

		this.$.password.forceFocusEnableKeyboard();
	}
},

deleteDomain: function(sender, index)
{
	if (this.domains[index]) {
		this.domains.splice(index, 1);
		enyo.setCookie("recentdomains", enyo.json.stringify(this.domains));
		this.$.domains.refresh();
	}
},

searchDomain: function(sender, e)
{
	this.filter = (this.$.searchBox.getValue() || "").toLowerCase();
	if (!this.filter.length) {
		this.filter = null;
	}

	this.$.domains.refresh();
}

});

