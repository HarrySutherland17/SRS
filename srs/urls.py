from . import views
from django.contrib.auth import views as auth_views
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('logout/', views.logout, name='logout'),
    path('', views.index, name='index'),
    path('decks/', views.decks, name='decks'),
    path('add/', views.add, name='add'),
    path('add_deck/', views.add_deck, name='add_deck'),
    path('learn/<int:deck_id>/', views.learn, name='learn'), # deck_id is defined in the href in decks.html
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('learn/<int:deck_id>/handle_learnt_cards', views.handle_learnt_cards, name='handle_learnt_cards'),
    path('learn/<int:deck_id>/handle_reviewed_cards', views.handle_reviewed_cards, name='handle_reviewed_cards')
]