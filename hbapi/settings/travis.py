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

REDIS_URL = 'redis://localhost:6379/?db=0'
REDIS_POOL = redis.ConnectionPool.from_url(REDIS_URL)
REDIS_CONN = redis.Redis(connection_pool=REDIS_POOL)
