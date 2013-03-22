start: node_modules components
	@../node_modules/.bin/coffee server

node_modules: package.json
	@npm install

components: component.json
	@../node_modules/.bin/component install

clean:
	@rm -rf build

.PHONY: clean start
