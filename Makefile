.PHONY: install dev build studio harness test lint typecheck docker clean
install:   ## install dependencies
	npm install --no-audit --no-fund
dev:       ## run the dev server (http://localhost:3000)
	npm run dev
build:     ## production build (typecheck · lint · test · build)
	npm run build
studio:    ## menu-driven builder
	npm run studio
test:      ## run tests
	npm test
lint:      ## lint
	npm run lint
typecheck: ## typecheck
	npm run typecheck
docker:    ## build the container image
	docker build -t syntheon .
clean:
	rm -rf .next node_modules
