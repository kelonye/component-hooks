LIB = $(shell find lib -type f)

test: node_modules $(LIB)
	@mocha --compilers coffee:coffee-script -R dot

node_modules:
	@npm install

example/: node_modules
	@cd $@ && ../node_modules/.bin/coffee server/

clean:
	@rm -rf example/public

.PHONY: clean example/ test
