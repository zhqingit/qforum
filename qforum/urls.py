"""qforum URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import sys
sys.path.insert(0,'..')
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from ariadne.contrib.django.views import GraphQLView
from gql.schema import schema
from django.views.decorators.csrf import csrf_exempt
from gql.resolvers.context import contextValue

urlpatterns = [
    path('admin/', admin.site.urls),
    #path('graphql/', csrf_exempt(GraphQLView.as_view(schema=schema, context_value=contextValue)),name='graphql'),
    path('graphql/', GraphQLView.as_view(schema=schema, context_value=contextValue),name='graphql'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
#urlpatterns += static(settings.MEDIA_URL)
