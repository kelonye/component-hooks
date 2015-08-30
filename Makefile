test: node_modules
	@mocha -R dot

node_modules:
	@npm install

example: node_modules
	@cd $@ && DEBUG=builder:*,app* node server

clean:
	@rm -rf example/public

.PHONY: clean example test
