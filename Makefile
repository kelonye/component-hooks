SRC = $(shell find src -name "*.coffee" -type f)
LIB = $(SRC:src/%.coffee=lib/%.js)

test: node_modules lib lib/utils.js $(LIB)
	@mocha --compilers coffee:coffee-script -R dot

example: example/ node_modules
	@cd $< && ../node_modules/.bin/coffee server

node_modules:
	@npm install

lib:
	@mkdir -p lib

lib/%.js: src/%.coffee
	coffee -bcj $@ $<

lib/utils.js: src/utils.js
	@rm -f $@
	@cp $< $@

clean:
	@rm -rf lib

.PHONY: clean example test
