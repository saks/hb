import dj_database_url
import os

from .base import *

DEBUG = False
TEMPLATE_DEBUG = DEBUG

ADMINS = [('znotdead', 'zhirafchik@gmail.com')]

DATABASES['default'] = dj_database_url.config()

STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'

ALLOWED_HOSTS = [".herokuapp.com", ]

REDIS_POOL = redis.ConnectionPool.from_url(os.environ.get('REDISCLOUD_URL'))
REDIS_CONN = redis.Redis(connection_pool=REDIS_POOL)
