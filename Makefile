all: pep pylint test

test:
	@bin/exec test

build:
	docker-compose build web

run:
	@docker-compose run --rm -p 8000:8000 web python manage.py runserver 0.0.0.0:8000

setup: migrate createsuperuser

migrate:
	@bin/exec migrate

production_dbshell:
	heroku run python manage.py dbshell --settings=hbapi.settings.heroku --app home-b

createsuperuser:
	@bin/exec createsuperuser

pep:
	@bin/docker_exec pycodestyle .

pylint:
	@bin/docker_exec prospector .

shell:
	@bin/docker_exec bash

static:
	parcel build static/app/scripts/app.js \
		--out-file app.min \
		--out-dir static/app/scripts \
		--public-url="/static/app/scripts" \
		--detailed-report

.PHONY: pep all pylint test build run migrate setup createsuperuser production_dbshell shell static
