FROM django:latest

ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/

RUN apt-get update && apt-get install -y git-core
RUN git config --system user.name docker && git config --system user.email docker@localhost

RUN pip install --upgrade pip
RUN pip install -r requirements.txt
