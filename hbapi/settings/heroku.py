import dj_database_url
import os
import urlparse

from .base import *

DEBUG = False
TEMPLATE_DEBUG = DEBUG

ADMINS = [('znotdead', 'zhirafchik@gmail.com')]

DATABASES['default'] = dj_database_url.config()

STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'

ALLOWED_HOSTS = [".herokuapp.com", ]

redis_url = urlparse.urlparse(os.environ.get('REDIS_URL'))
REDIS_POOL = redis.ConnectionPool(host=redis_url.hostname,
                                  port=redis_url.port,
                                  password=redis_url.password,
                                  db=0)
REDIS_CONN = redis.Redis(connection_pool=REDIS_POOL)

#CACHES = {
#    "default": {
#         "BACKEND": "redis_cache.RedisCache",
#         "LOCATION": "{0}:{1}".format(redis_url.hostname, redis_url.port),
#         "OPTIONS": {
#             "PASSWORD": redis_url.password,
#             "DB": 0,
#         }
#    }
#}
