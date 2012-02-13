# PwdHash HD
################################################################################

# Set DEVICE to the IP address of the device or simulator to support installing
# If the defice has a password then you should include the password argument.
# For example: export DEVICE=10.0.0.9 -password foobar

# Set PASSWORD to the password of the key to use when signing the package. If
# not set then a debug build will be created.

BBWP		:= /Developer/SDKs/Research\ In\ Motion/BlackBerry\ WebWorks\ SDK\ for\ TabletOS\ 2.2.0.5/bbwp/bbwp
RIMSDK		:= /Developer/SDKs/Research\ In\ Motion/BlackBerry\ WebWorks\ SDK\ for\ TabletOS\ 2.2.0.5/bbwp/blackberry-tablet-sdk/bin/
BAR			:= $(PKG).bar
ZIP			:= $(PKG).zip
BUILDID		:= 1

ifndef ENYODIR
ENYODIR		:= ../enyo-1.0-r1/
endif

BBWPARGS	:= $(ZIP)

ifdef BUILDID
BBWPARGS	:= $(BBWPARGS) -buildId $(BUILDID)
endif

ifdef PASSWORD
BBWPARGS	:= $(BBWPARGS) -g $(PASSWORD)
else
BBWPARGS	:= $(BBWPARGS) -d
endif

config.xml: config.xml.in
	@cat config.xml.in | sed -e s/autoversion/$(VERSION)/ > config.xml

.tmp: config.xml appinfo.json
	@rm -rf .tmp 2>/dev/null || true
	@mkdir -p .tmp/enyo/
	@cp -r $(ENYODIR)/framework .tmp/enyo/
	@cp -r $(ENYODIR)/LICENSE-2.0.txt .tmp/enyo/
	@cp -r depends.js source popup dashboard window css .tmp/
	@cp config.xml appinfo.json framework_config.json .tmp/
	@cp playbook.html .tmp/index.html
	@cp icon-86.png lock-small.png .tmp/

$(ZIP): .tmp
	@rm -rf $(ZIP) 2>/dev/null || true
	@(cd .tmp && zip -r ../$(ZIP) *)

$(BAR): $(ZIP)
	$(BBWP) $(BBWPARGS) -o .

all: $(BAR)


install: $(BAR)
	$(RIMSDK)/blackberry-deploy -installApp $(DEVICE) $(BAR)

clean:
	@rm -rf .tmp $(ZIP) $(BAR) appinfo.json config.xml 2>/dev/null || true

launch:
	@echo launch does not work yet

log:
	@echo log does not work yet

test: .tmp
	@echo test does not work yet

.PHONY: clean install launch log test

