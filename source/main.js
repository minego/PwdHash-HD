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

// TODO	Show the details for a domain here...
//
//		Show the domain name field (filled out if a domain is selected on the
//		left), the password and the generated hash

// TODO	Show a "Copy" button that puts the hashed password into the clipboard
//		(with a timer to clear it)

// TODO	Show an X on the right of each input to allow clearing it easily

// TODO	Generate the password as the inputs change

// TODO	Select the password field on launch?

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
							className:					"enyo-preferences-box",
							components: [
								{
									kind:				enyo.RowGroup,
									caption:			$L("Password Details"),
									components: [
										{
											name:		"domain",
											kind:		enyo.Input,
											hint:		$L("Site Address"),

											autocorrect:false,
											inputType:	"url",
											changeOnInput:
														true,
											selectAllOnFocus:
														true,
											onchange:	"generate"
										},
										{
											name:		"password",
											kind:		enyo.PasswordInput,
											hint:		$L("Password"),

											autocorrect:false,
											changeOnInput:
														true,
											selectAllOnFocus:
														true,
											onchange:	"generate"
										}
									]
								},

								{
									kind:				enyo.RowGroup,
									caption:			$L("Generated Password"),
									components: [
										{
											name:		"generated",
											kind:		enyo.Control,
											content:	""
										}
									]
								},

								{
									kind:				enyo.Button,
									caption:			$L("Copy Generated Password"),
									onclick:			"copy"
								},

								{
									kind:				enyo.Button,
									caption:			$L("Reset Details"),
									onclick:			"reset"
								},

								{
									kind:				enyo.Button,
									caption:			$L("Open Page"),
									onclick:			"Launch Browser"
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
	this.inherited(arguments);

	enyo.keyboard.setResizesWindow(true);
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

resizeHandler: function()
{
},

generate: function()
{
	var uri		= this.$.domain.getValue();
	var pass	= this.$.password.getValue();
	var domain;

	if (uri.length > 0 && pass.length > 0) {
		domain = (new SPH_DomainExtractor()).extractDomain(uri);

		this.$.generated.setContent(new String(new SPH_HashedPassword(pass, domain)));
	} else {
		this.$.generated.setContent();
	}
}


});

