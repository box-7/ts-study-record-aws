.PHONY: deploy

deploy:
	firebase deploy --only hosting

test:
	npm run test