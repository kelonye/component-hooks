SRC = $(shell find src -name "*.coffee" -type f)
LIB = $(SRC:src/%.coffee=lib/%.js)

test: node_modules lib $(LIB) lib/utils.js
	@mocha --compilers coffee:coffee-script -R dot

node_modules: package.json
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

.PHONY: clean test
