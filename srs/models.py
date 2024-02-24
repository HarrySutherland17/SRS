from django.db import models
from django.contrib.auth.models import User
from datetime import date

class Deck(models.Model):
    name = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='decks')
    
    def __str__(self):
        return self.name

class Card(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    front = models.CharField(max_length=200)
    back = models.CharField(max_length=200)
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE, related_name='cards')
    n = models.IntegerField(max_length=200, default=0)
    i = models.FloatField(max_length=200, default=0)
    review_date = models.DateField(default=date.today())
    constant_i = models.FloatField(default=2.5)
    learnt = models.BooleanField(default=False)
    
    def __str__(self):
        return self.front
