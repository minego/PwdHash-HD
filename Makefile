# PwdHash Pro
################################################################################

debug: clean
	rm -rf .active 2>/dev/null || true
	ln -s debug .active

release: clean
	rm -rf .active 2>/dev/null || true
	ln -s release .active

################################################################################

appinfo:
	svn info | grep "Last Changed Rev" | sed 's/.*: *//' | sed 's/\(.*\)\([0-9][0-9]\)/s\/autoversion\/2.\1.\2\//' > .version
	cat .active/appinfo.json | sed -f .version > appinfo.json

all: appinfo
	rm -rf .tmp 2>/dev/null || true
	mkdir .tmp
	cp -r appinfo.json window dashboard source css index.html depends.js *.png .tmp
	palm-package .tmp
	rm -rf .tmp

install: all
	palm-install *.ipk

clean:
	rm *.ipk 2>/dev/null || true
	rm -rf .tmp 2>/dev/null || true
	rm .version appinfo.json || true

appid:
	grep '"id"' .active/appinfo.json | cut -d: -f2 | cut -d'"' -f2 > .active/appid

launch: install appid
	palm-launch -i `cat .active/appid`

log: appid
	-palm-log -f `cat .active/appid` | sed -u							\
		-e 's/\[[0-9]*-[0-9]*:[0-9]*:[0-9]*\.[0-9]*\] [a-zA-Z]*: //'	\
		-e 's/indicated new content, but not active./\n\n\n/'

test: launch log
	true

.PHONY: beta debug release clean appinfo

