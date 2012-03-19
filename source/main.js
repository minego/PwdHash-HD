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
// TODO	Allow other apps to call this as using enyo.CrossAppUI?

enyo.kind(
{

name:													"net.minego.pwdhash",
kind:													enyo.VFlexBox,

components: [
	{
		kind:											enyo.ApplicationEvents,
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

		components: [{
			caption:									"About PwdHash",
			onclick:									"openAbout"
		}]
	},

	{
		kind:											enyo.SlidingPane,
		flex:											1,
		components: [{
			name:										"list",
			width:										"320px",

			components: [{
				kind:									enyo.Header,
				width:									"100%",
				components: [{
					kind:								enyo.VFlexBox,
					flex:								1,
					align:								"center",
					components: [{
						content:						$L("Recent Domains")
					}]
				}]
			}, {
				name:									"searchBox",
				className:								"enyo-box-input",
				kind:									enyo.SearchInput,
				hint:									$L("Search"),

				onchange:								"searchDomain",
				onCancel:								"searchDomain",
				changeOnInput:							true
			}, {
				kind:									enyo.FadeScroller,
				horizontal:								false,
				flex:									1,

				components: [{
					name:								"domains",
					kind:								enyo.VirtualList,
					onSetupRow:							"setupDomain",

					components: [{
						onclick:						"selectDomain",
						onConfirm:						"deleteDomain",

						name:							"item",
						kind:							enyo.SwipeableItem,
						className:						"toaster-item",
						layoutKind:						"VFlexLayout",
						pack:							"center",
						tapHighlight:					true,
						confirmRequired:				false,

						components: [{
							name:						"title",
							className:					"url-item-title enyo-text-ellipsis"
						}, {
							name:						"url",
							className:					"url-item-url enyo-item-ternary enyo-text-ellipsis"
						}]
					}]
				}]
			}]
		}, {
			name:										"details",
			flex:										1,
			align:										"center",

			components: [{
				kind:									enyo.VFlexBox,
				align:									"center",

				components: [{
					kind:								enyo.Header,
					width:								"100%",
					name:								"TitleBar",

					components: [{
						kind:							enyo.VFlexBox,
						flex:							1,
						align:							"center",
						components: [{
							content:					$L("Generate Password")
						}]
					}]
				}, {
					kind:								enyo.Control,
					style:								"margin: 5px auto 0; width: 90%;",

					components: [{
						kind:							enyo.RowGroup,
						caption:						$L("Domain"),
						components: [{
							name:						"domain",
							kind:						enyo.Input,
							hint:						$L("Enter Site Address"),

							autocorrect:				false,
							inputType:					"url",
							changeOnInput:				true,
							selectAllOnFocus:			true,
							autoCapitalize:				"lowercase",
							onchange:					"valueChanged",
							onblur:						"saveDomain"
						}]
					},{
						kind:							enyo.RowGroup,
						caption:						$L("Master Password"),
						components: [{
							name:						"password",
							kind:						enyo.PasswordInput,
							hint:						$L("Enter Password"),

							autocorrect:				false,
							changeOnInput:				true,
							selectAllOnFocus:			true,
							onchange:					"valueChanged"
						}]
					},{
						kind:							enyo.RowGroup,
						caption:						$L("Generated Password"),
						components: [{
							name:						"generated",
							kind:						enyo.Input,
							selectAllOnFocus:			true,
							hint:						""
						}]
					}, {
						kind:							enyo.Button,
						caption:						$L("Copy Password"),
						name:							"copy",
						onclick:						"copyPass"
					}, {
						kind:							enyo.Button,
						caption:						$L("Reset Details"),
						name:							"reset",
						onclick:						"resetForm"
					}, {
						kind:							enyo.Button,
						caption:						$L("Launch Browser"),
						name:							"openURL",
						onclick:						"openURL"
					}, {
						kind:							enyo.Button,
						caption:						$L("About"),
						onclick:						"openAbout"
					}]
				}]
			}]
		}]
	},

	{
		name:											"about",
		kind:											enyo.ModalDialog,
		width:											"400px",

		components: [{
			layoutKind:									"VFlexLayout",
			pack:										"center",

			components: [{
				className:								"enyo-text-header",
				kind:									enyo.Control,
				nodeTag:								"h3",
				style:									"padding-left: 1em;",
				content:								"About PwdHash"
			}, {
				kind:									enyo.FadeScroller,
				height:									"400px",
				components: [{
					kind:								enyo.HtmlContent,
					className:							"eny-text-body",
					style:								"padding: 1em;",
					onLinkClick:						"linkClick",
					content: [
						"<p>",
						"	This app is provided \"as is\" with no warranties expressed or",
						"	implied.  Use at your own risk.",
						"</p>",
						"",
						"<p>",
						"	PwdHash HD was developed by",
						"	<a href=\"http://www.github.com/minego/PwdHash-HD/\">minego</a>",
						"	using the resources listed below.",
						"</p>",
						"",
						"<p>",
						"	The <a href=\"http://www.pwdhash.com/\">Stanford PwdHash</a>",
						"	provides an easy and secure method of creating a unique password",
						"	for every site you visit.",
						"</p>",
						"",
						"<p>",
						"	The password is created by creating a hash of the site's domain",
						"	name, and a master password.  The result is that you only have",
						"	to remember one password, but you get the benefits of having",
						"	a different password on each site.",
						"</p>",
						"",
						"<p>",
						"	This application uses the same source and algorithms as the",
						"	<a href=\"http://www.pwdhash.com/\">Stanford PwdHash</a> site.",
						"	If you use the chrome or firefox plugin then the password",
						"	generated will be the same.",
						"</p>"
					].join('\n')
				}]
			},
				{
					caption:							$L("Close"),
					kind:								enyo.Button,
					onclick:							"closeAbout"
				}
			]
		}]
	}
],

create: function()
{
	this.inherited(arguments);

	this.value = null;

	var json = null;

	if (window.localStorage) {
		json = window.localStorage.getItem("recentdomains");
	}

	if (!json) {
		json = enyo.getCookie("recentdomains");
	}

	try {
		if (json) {
			this.domains = enyo.json.parse(json);
			this.log(this.domains);
		} else {
			this.domains = [];
		}
	} catch(e) {
		this.domains = [];
	}

	enyo.keyboard.setResizesWindow(true);

	try {
		/*
			The WebWorks SDK for the PlayBook does not support clipboard access
			out of the box, but it may be allowed with the use of an extension.

			If the extension is present then we should use it. If not then the
			password should be displayed as a text input instead so that the
			user can copy the text manually.
		*/
		if (net.minego.nocopy && blackberry.clipboard.setText) {
			net.minego.nocopy = false;
		}
	} catch (e) {
	}
},

rendered: function()
{
	this.inherited(arguments);

	this.$.domain.forceFocusEnableKeyboard();
	this.valueChanged();

	if (net.minego.nocopy) {
		/*
			Get rid of the copy button if there is no supported way to copy the
			text on this platform.
		*/
		this.$.copy.destroy();
	}

	if (net.minego.playbook) {
		/*
			Hide the title bar to save room so that more can fit on the screen
			on the playbook, since it's screen isn't very tall.
		*/

		this.$.TitleBar.destroy();
	}
},

openAppMenu: function(sender, e)
{
	this.$.AppMenu.open();
},

closeAppMenu: function()
{
	this.$.AppMenu.close();
},

valueChanged: function()
{
	var uri;
	var pass;
	var domain;

	try {
		uri = this.$.domain.getValue();
	} catch (e) {
		uri = '';
	}

	try {
		pass = this.$.password.getValue();
	} catch (e) {
		pass = '';
	}

	if (uri.length > 0 && pass.length > 0) {
		domain = (new SPH_DomainExtractor()).extractDomain(uri);
		this.value = new String(new SPH_HashedPassword(pass, domain.toLowerCase()));
	} else {
		this.value = null;
	}

	this.$.generated.setValue(this.value || '');

	this.$.openURL.setDisabled(uri.length == 0);
	this.$.reset.setDisabled(pass.length == 0 && uri.length == 0);

	if (this.$.copy) {
		this.$.copy.setCaption($L("Copy Password"));
		this.$.copy.setDisabled(!this.value);
	}
},

copyPass: function()
{
	if (this.$.copy) {
		this.$.copy.setDisabled(true);
		this.$.copy.setCaption($L("Password Copied"));
	}

	if (!window.PalmSystem) {
		try {
			blackberry.clipboard.setText(this.value);
		} catch (e) {
			enyo.dom.setClipboard(this.value);
		}
	} else {
		enyo.windows.openDashboard("../dashboard/index.html", "dash", {
			value:						this.value
		}, {
			clickableWhenLocked:		true
		});
	}

	this.saveDomain();
},

saveDomain: function(domain)
{
	var last;

	if (!domain || "string" !== typeof domain) {
		domain = this.$.domain.getValue();
	}

	if (!domain || !domain.length) {
		return;
	}

	if (-1 != enyo.indexOf(domain, this.domains)) {
		/* Already there */
		return;
	}

	this.domains.push(domain);

	/* Save the list */
	if (window.localStorage) {
		window.localStorage.setItem("recentdomains", enyo.json.stringify(this.domains));
	}

	enyo.setCookie("recentdomains", enyo.json.stringify(this.domains));
	this.$.domains.refresh();
},

resetForm: function()
{
	this.$.domain.setValue('');
	this.$.password.setValue('');

	this.$.generated.setValue('');
	this.valueChanged();
},

openURL: function()
{
	var domain = this.$.domain.getValue();
	this.linkClick(this, domain);
},

clear: function()
{
	enyo.application.launcher.clear();
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
		this.valueChanged();

		this.$.password.forceFocusEnableKeyboard();
	}
},

deleteDomain: function(sender, index)
{
	if (this.domains[index]) {
		this.domains.splice(index, 1);

		if (window.localStorage) {
			window.localStorage.setItem("recentdomains", enyo.json.stringify(this.domains));
		}

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
},

openAbout: function()
{
	this.$.about.openAtCenter();
},

closeAbout: function()
{
	this.$.about.close();
},

linkClick: function(sender, url)
{
	if (0 != url.indexOf("http://") && 0 != url.indexOf("https://")) {
		url = "http://" + url;
	}

	try {
		blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER,
			new blackberry.invoke.BrowserArguments(url));
	} catch (e) {
		window.open(url, '_blank');
	}
}

});

