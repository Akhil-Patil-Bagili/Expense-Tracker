from pathlib import Path
from datetime import timedelta
import os
import django_heroku
import dj_database_url
from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv



load_dotenv() 


def get_env_variable(var_name, default_value=None):
    try:
        return os.environ[var_name]
    except KeyError:
        if default_value is not None:
            return default_value
        else:
            error_msg = f"Set the {var_name} environment variable"
            raise ImproperlyConfigured(error_msg)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = get_env_variable('DJANGO_SECRET_KEY','django-insecure-5lt_gu87^hplnp*ygcfjp0v(^dh_-&8694j7k%f=&asvsh1i+q')

# DEBUG = get_env_variable('DJANGO_DEBUG', 'False') == 'True'
DEBUG = True

ALLOWED_HOSTS = ['expense-tracker-bagili.herokuapp.com', '.herokuapp.com', 'localhost', '127.0.0.1', '0.0.0.0']


INSTALLED_APPS = [
    'whitenoise.runserver_nostatic',
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
    'users',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'frontend/build')],  # Serve the React build folder
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# DATABASES = {
#             'default': {
#             'ENGINE': 'django.db.backends.postgresql',
#             'NAME': 'expense_tracker',  # Update with your local database name
#             'USER': 'trevor',  # Update with your local database user
#             'PASSWORD': 'gtafive',  # Update with your local database password
#             'HOST': 'localhost',
#             'PORT': '5432',
#         }
# }
DATABASES = {}
DATABASE_URL = get_env_variable('DATABASE_URL', None)

if DEBUG or not DATABASE_URL:
    DATABASES['default'] = {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'expense_tracker',  # Update with your local database name
        'USER': 'trevor',  # Update with your local database user
        'PASSWORD': 'gtafive',  # Update with your local database password
        'HOST': 'localhost',
        'PORT': '5432',
        'OPTIONS': {'sslmode' : 'disable'},
    }
else:
    DATABASES['default'] = dj_database_url.config(default=DATABASE_URL)

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ORIGIN_ALLOW_ALL = True
# CORS_ALLOWED_ORIGINS = [
#     "https://expense-tracker-bagili.netlify.app", 
#     # "*.netlify.app", 
#     "http://localhost:3000",
# ]

CORS_EXPOSE_HEADERS = [
    'Access-Control-Allow-Origin',
    # ... other headers you want to expose
]

CORS_ALLOW_CREDENTIALS = True

DATABASES['default'] = dj_database_url.config(conn_max_age=600)
STATICFILES_DIRS = []
WHITENOISE_ROOT = os.path.join(BASE_DIR, 'staticfiles', 'root')
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

if 'django.middleware.security.SecurityMiddleware' in MIDDLEWARE:
    MIDDLEWARE.remove('django.middleware.security.SecurityMiddleware')
MIDDLEWARE.insert(0, 'corsheaders.middleware.CorsMiddleware')
MIDDLEWARE.insert(1, 'django.middleware.security.SecurityMiddleware')

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
    'SLIDING_TOKEN_LIFETIME': timedelta(days=7),
    'SLIDING_TOKEN_REFRESH_ON_LOGIN': True,
    'SLIDING_TOKEN_REFRESH_ON_REFRESH': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}


if 'DYNO' in os.environ:
    django_heroku.settings(locals(), staticfiles=False)


# import django_heroku
# django_heroku.settings(locals(), staticfiles=False)


#Chat Bot
OPENAI_API_KEY = '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'  # Replace with your actual API key


LOGIN_URL = '/login/'
