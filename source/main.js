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

name:							"net.minego.pwdhash",
kind:							enyo.Control,

components: [
	{
		kind:					"ApplicationEvents",
		onWindowActivated:		"activated",
		onWindowDeactivated:	"deactivated",
		onWindowShown:			"activated",
		onWindowHidden:			"deactivated",
		onOpenAppMenu:			"openAppMenu",
		onCloseAppMenu:			"closeAppMenu"
	},

	{
		name:					"AppMenu",
		kind:					"AppMenu",
		onBeforeOpen:			"beforeMenu"
	},

	{
		kind:					enyo.Control,
		content:				"Work in progress"
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
}


});

