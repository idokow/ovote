from django.urls import path

from . import views

urlpatterns = [
    path('', views.main_page, name='main'),
    path('about/', views.about, name='about'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('make_new/', views.make_new, name='make_new'),
    path('vote/<int:surveyID>', views.view_survey, name='vote'),
]
