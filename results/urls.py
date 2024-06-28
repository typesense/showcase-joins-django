from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("driver/", views.DriverList.as_view()),
    path("driver/search", views.DriverSearch.as_view()),
    path("driver/<int:pk>/", views.DriverDetail.as_view()),
]
urlpatterns = format_suffix_patterns(urlpatterns)
