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

name:							"net.minego.pwdhash.dashboard",
kind:							enyo.HFlexBox,
align:							"center",
className:						"notification",

components: [
	{
		name:					"appEvent",
		kind:					"ApplicationEvents",
		onWindowParamsChange:	"change"
	},
	{
		kind:					enyo.Image,
		src:					"../lock-small.png",
		onclick:				"goaway"
	},
	{
		kind:					enyo.VFlexBox,
		onclick:				"goaway",
		flex:					1,
		className:				"info",
		components: [
			{
				className:		"title",
				content:		$L("Password Copied")
			},
			{
				content:		$L("Tap to clear clipboard")
			}
		]
	}
],

create: function()
{
	this.destroy = enyo.bind(this, this.destroy);
	window.addEventListener('unload', this.destroy);

	this.inherited(arguments);
},

destroy: function()
{
	window.removeEventListener('unload', this.destroy);

	this.clear();
	this.inherited(arguments);
},

change: function()
{
	this.log(enyo.windowParams);

	if (enyo.windowParams.value) {
		this.copy(enyo.windowParams.value);
	} else {
		this.clear();
	}
},



/*
	Manage the dashboard from the launcher so that the dashboard items can still
	be used after the window has been closed.
*/
copy: function(value)
{
	this.log(value);
	enyo.dom.setClipboard(value);

	enyo.windows.addBannerMessage($L("Password Copied"), "{}");
/*
	enyo.application.dashboard.setLayers([{
		icon:		"lock-small.png",
		title:		"Password Copied",
		text:		"Tap to clear clipboard"
	}]);
*/
},

clear: function()
{
	this.log();

	/* An empty string doesn't work, so use a space */
	enyo.dom.setClipboard("ignore me");
	enyo.dom.setClipboard(" ");

	enyo.windows.addBannerMessage($L("Cleared clipboard"), "{}");
},

goaway: function()
{
	this.clear();
	window.close();
}

});
