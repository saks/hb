all: lint test

test:
	@bin/exec test

build:
	docker-compose build web

run:
	@docker-compose run --rm -p 8000:8000 web python manage.py runserver 0.0.0.0:8000

setup: createsuperuser migrate

migrate:
	@bin/exec migrate

createsuperuser:
	@bin/exec createsuperuser

lint:
	@bin/docker_exec pep8 . --max-line-length=99 --count --exclude=*migrations/*.py

.PHONY: all test lint build run migrate setup createsuperuser
