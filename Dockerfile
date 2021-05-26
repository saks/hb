FROM python:3-slim

RUN apt-get update && apt-get install -y \
        gcc \
        gettext \
        git \
        postgresql-contrib postgresql-client libpq-dev python3-dev \
--no-install-recommends && rm -rf /var/lib/apt/lists/*


ENV DJANGO_VERSION 3.0.3
ENV PYTHONUNBUFFERED 1

RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/

RUN git config --system user.name docker && git config --system user.email docker@localhost

RUN pip install --upgrade pip
RUN pip install -r requirements.txt
EXPOSE 8008
CMD ["python", "manage.py", "runserver", "0.0.0.0:8008"]
