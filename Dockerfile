FROM python:3.6

RUN apt-get update && apt-get install -y \
        gcc \
        gettext \
        postgresql-client libpq-dev \
--no-install-recommends && rm -rf /var/lib/apt/lists/*

RUN apt-get install -y git-core

ENV DJANGO_VERSION 1.11.6
ENV PYTHONUNBUFFERED 1

RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/

RUN git config --system user.name docker && git config --system user.email docker@localhost

RUN pip install --upgrade pip
RUN pip install psycopg2
RUN pip install -r requirements.txt
EXPOSE 8008
CMD ["python", "manage.py", "runserver", "0.0.0.0:8008"]
