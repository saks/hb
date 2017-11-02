FROM python:latest

RUN apt-get update && apt-get install -y \
        gcc \
        gettext \
        postgresql-client libpq-dev \
--no-install-recommends && rm -rf /var/lib/apt/lists/*

        #mysql-client libmysqlclient-dev \
        #sqlite3 \

RUN apt-get install -y git-core

ENV DJANGO_VERSION 1.11.6
ENV PYTHONUNBUFFERED 1

RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/

RUN git config --system user.name docker && git config --system user.email docker@localhost

RUN pip install --upgrade pip
RUN pip install psycopg2
#RUN pip install mysqlclient 
#RUN pip install django=="$DJANGO_VERSION"
RUN pip install -r requirements.txt
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
