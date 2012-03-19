================================================================================
 PwdHash HD - Support for pwdhash.com style password hashes in webOS 3.x
================================================================================

Author: 	Micah N Gorrell
Twitter:	@_minego
Email: 		pwdhash@minego.net
Web:		http://minego.net

================================================================================
 PwdHash HD license:
================================================================================

You may do whatever you want with this source code with the following conditions:
 1.	You may not use reproductions, distributions, modifications, or any part of
	this source code or included images, graphics, or other media for commercial
	purposes

 2.	You may not use the "PwdHash HD" name or marks, or Micah N Gorrell, or
	minego in a manner that implies endorsement or "official" involvement.

 3.	You must retain this license notice.

Email license@minego.net if you need an exception made to the license.

Copyright 2010 - 2011 Micah N Gorrell



================================================================================
 Usage
================================================================================

	Either the webOS SDK or the WebWorks SDK must be installed to build this
	application. The build system depends on GNU make, and a handful of other
	command line unix tools. It has been tested on ubuntu and should work with
	cygwin.

	Select a platform to build for by running one of the following:
		export PLATFORM=webos
		export PLATFORM=playbook

	Select a build type by running one of the following:
		make release
		make debug
		make beta

	Build by running:
		make clean all

	Install the ipk on a device or the emulator by running:
		make install

	Launch the ipk on a device or the emulator by running:
	(Not supported on the playbook yet)
		make launch

	Watch the log on a device or the emulator by running:
	(Not supported on the playbook yet)
		make log


	The WebWorks SDK does not support clipboard access out of the box. Support
	can be added by installing this extension before building:

		https://github.com/MaKleSoft/WebWorks-Community-APIs/tree/master/Tablet/Clipboard


