from .base import *


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'postgres',
        'USER': 'postgres',
        'HOST': 'db',
        'PORT': 5432,
    }
}

REDIS_POOL = redis.ConnectionPool(host='redis', port=6379, db=0)
REDIS_CONN = redis.Redis(connection_pool=REDIS_POOL)
