test: node_modules
	@mocha -R dot

node_modules:
	@npm install

example/: node_modules
	@cd $@ && ../node_modules/.bin/coffee server/

clean:
	@rm -rf example/public

.PHONY: clean example/ test
