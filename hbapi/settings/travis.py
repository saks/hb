from .base import *


if 'TRAVIS' in os.environ:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'postgres',
            'USER': 'postgres',
            'HOST': 'localhost',
            'PORT': 5432,
        }
    }

REDIS_POOL = redis.ConnectionPool(host='localhost', port=6379, db=0)
REDIS_CONN = redis.Redis(connection_pool=REDIS_POOL)
