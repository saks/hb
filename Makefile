all: pep pylint test

start:
	docker compose up -d

test:
	@bin/exec test

build:
	docker compose build web

run:
	@docker compose run --rm -p 8008:8008 web python manage.py runserver 0.0.0.0:8008

setup: migrate createsuperuser

migrate:
	@bin/exec migrate

production_dbshell:
	heroku run python manage.py dbshell --settings=hbapi.settings.heroku --app home-b

production_shell:
	heroku run python manage.py shell --settings=hbapi.settings.heroku --app home-b

psql:
	@bin/docker_exec python manage.py dbshell

c:
	@bin/docker_exec python manage.py shell

createsuperuser:
	@bin/exec createsuperuser

pep:
	@bin/docker_exec pycodestyle .

pylint:
	@bin/docker_exec prospector .

sh:
	@bin/docker_exec bash

shell:
	docker exec -it web bash 

restore_db:
	pg_restore --verbose --clean --no-acl --no-owner -h db -U postgres -d postgres <filename>

.PHONY: pep all pylint test build run migrate setup createsuperuser production_dbshell sh \
	production_shell psql shell c
