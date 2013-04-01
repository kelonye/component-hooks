SRC = $(shell find src -name "*.coffee" -type f)
LIB = $(SRC:src/%.coffee=lib/%.js)

test: node_modules example/node_modules lib $(LIB) lib/utils.js
	@mocha --compilers coffee:coffee-script -R dot

node_modules:
	@npm install

example/node_modules:
	@cd example && npm install && cd ..

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
