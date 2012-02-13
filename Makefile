APP			:= pwdhash
VENDOR		:= net.minego
APPID		:= $(VENDOR).$(APP)
PKG			:= PwdHashHD
VERSION		:= 2.0.$(shell git log --pretty=format:'' | wc -l | sed 's/ *//')

debug:
	@rm -rf .active 2>/dev/null || true
	@ln -s debug .active

release:
	@rm -rf .active 2>/dev/null || true
	@ln -s release .active

################################################################################

.active:
	@ln -s release .active || true

appinfo.json: .active
	@cat .active/appinfo.json | sed -e s/autoversion/$(VERSION)/ > appinfo.json


################################################################################
# Load the platform specific rules
################################################################################

ifndef PLATFORM

%:
	@echo "The PLATFORM variable must be set to \"webos\" or \"playbook\"."
	@false

else

include $(PLATFORM).mk

endif

################################################################################
