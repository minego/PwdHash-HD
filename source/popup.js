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

enyo.kind(
{

name:								"net.minego.pwdhash.popup",
kind:								enyo.VFlexBox,
align:								"center",
className:							"notification",

components: [
	{
		kind:						enyo.ApplicationEvents,
		name:						"appEvent",
		onWindowParamsChange:		"change"
	},

	{
		kind:						enyo.HFlexBox,
		components: [
			{
				kind:				enyo.Image,
				src:				"../lock-small.png",
				onclick:			"close"
			},
			{
				kind:				enyo.VFlexBox,
				flex:				1,
				className:			"info",
				onclick:			"close",
				components: [
					{
						className:	"title",
						content:	$L("PwdHash Generated Password")
					},
					{
						name:		'password',
						content:	'',
						style:		'font-family: monospace; font-size: 24px; font-weight: bold;'
					}
				]
			}
		]
	}
],

create: function()
{
	this.log();

	this.destroy = enyo.bind(this, this.destroy);
	window.addEventListener('unload', this.destroy);

	this.inherited(arguments);
},

destroy: function()
{
	this.log();

	window.removeEventListener('unload', this.destroy);

	this.inherited(arguments);
},

change: function()
{
	this.log(enyo.windowParams);

	if (enyo.windowParams.value) {
		this.log(enyo.windowParams.value);
		this.$.password.setContent(enyo.windowParams.value);
	} else {
		this.$.password.setContent('');
	}
},

clear: function()
{
	this.log();

	/*
		Reopen the dashboard with a null value. It will take care of clearing
		the clipboard and hiding itself.
	*/
	enyo.windows.openDashboard("../dashboard/index.html", "dash", {
		value:						null
	}, {
		clickableWhenLocked:		true
	});

	window.close();
},

close: function()
{
	this.log();

	window.close();
}

});

