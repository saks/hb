all: pep pylint test

test:
	@bin/exec test

build:
	docker-compose build web

run:
	@docker-compose run --rm -p 8008:8008 web python manage.py runserver 0.0.0.0:8008

setup: migrate createsuperuser

migrate:
	@bin/exec migrate

production_dbshell:
	heroku run python manage.py dbshell --settings=hbapi.settings.heroku --app home-b

production_shell:
	heroku run python manage.py shell --settings=hbapi.settings.heroku --app home-b

createsuperuser:
	@bin/exec createsuperuser

pep:
	@bin/docker_exec pycodestyle .

pylint:
	@bin/docker_exec prospector .

shell:
	@bin/docker_exec bash

.PHONY: pep all pylint test build run migrate setup createsuperuser production_dbshell shell production_shell
