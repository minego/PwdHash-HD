# PwdHash HD
################################################################################

all: appinfo
	rm -rf .tmp 2>/dev/null || true
	mkdir .tmp
	cp -r appinfo.json window dashboard popup source css index.html depends.js *.png .tmp
	palm-package .tmp

install: all
	palm-install *.ipk

clean:
	rm *.ipk 2>/dev/null || true
	rm -rf .tmp 2>/dev/null || true
	rm appinfo.json || true

launch: install
	palm-launch -i $(APPID)

log:
	-palm-log -f $(APPID) | sed -u										\
		-e 's/\[[0-9]*-[0-9]*:[0-9]*:[0-9]*\.[0-9]*\] [a-zA-Z]*: //'	\
		-e 's/indicated new content, but not active./\n\n\n/'

test: launch log
	true

.PHONY: beta debug release clean appinfo

