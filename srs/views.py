from django.shortcuts import render, redirect, get_object_or_404
from django.forms import model_to_dict
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login as auth_login, authenticate, logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LogoutView
from .models import Deck, Card, User
from .forms import DeckForm, CardForm
import json
from datetime import date, timedelta


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            auth_login(request, user)
            return redirect('index')
    else:
        form = UserCreationForm()
    return render(request, 'srs/register.html', {
        'form': form
    })
    

def login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                auth_login(request, user)
                return redirect('index')
    else:
        form = AuthenticationForm()
    return render(request, 'srs/login.html', {'form': form})

def logout(request):
    auth_logout(request)
    return redirect('/')

def index(request):
    return render(request, 'srs/index.html')

def decks(request):
    decks = Deck.objects.filter(user=request.user)
    return render(request, 'srs/decks.html', {
        'decks': decks,
    })


def add_deck(request):
    form = DeckForm()
    
    if request.method == 'POST':
        form = DeckForm(request.POST)
        if form.is_valid():
            new_deck = form.save(commit=False)
            new_deck.user = request.user
            new_deck.save()
            return redirect('index')
    
    return render(request, 'srs/add_deck.html', {
        'form': form,
    })
    
def add(request):
    form = CardForm(user=request.user)
    
    if request.method == 'POST':
        form = CardForm(data=request.POST, user=request.user)
        if form.is_valid():
            new_card = form.save(commit=False)
            new_card.user = request.user
            new_card.save()
            return redirect('add')
    return render(request, 'srs/add.html', {
        'form': form,
    })
    
def learn(request, deck_id): # deck_id comes from the url of the view
    deck = get_object_or_404(Deck, pk=deck_id)
    cards = deck.cards.filter(learnt=True)

    n_cards = deck.cards.filter(learnt=False)
    r_cards = deck.cards.filter(review_date=date.today().strftime('%Y-%m-%d')) 
    new_cards = [model_to_dict(i, fields=["front", "back", "n", "i", "learnt"]) for i in n_cards]
    review_cards = [model_to_dict(i, fields=["front", "back", "n", "i", "learnt", "review_n", "constant_i"]) for i in r_cards]
    
    return render(request, 'srs/learn.html', {
        'deck': deck,
        'deck_id': deck_id,
        'new_cards': json.dumps(new_cards),
        'review_cards': json.dumps(review_cards),
    })

def handle_learnt_cards(request, deck_id):
    deck = get_object_or_404(Deck, pk=deck_id)
    if request.method == 'POST':
        cards_data = json.loads(request.body)
        
        for item in cards_data:
            card_front = item.get('front')
        
            if card_front:
                card = get_object_or_404(Card, front=card_front, deck=deck)
                card.learnt = item.get('learnt')
                card.i = item.get('i')
                card.n = item.get('n')
               
                card.save()
            else:
                return JsonResponse({"message": "Data failed to save"}, status=400)
        return JsonResponse({"message": "Data successfully saved"})
    
def handle_reviewed_cards(request, deck_id):
    deck = get_object_or_404(Deck, pk=deck_id)
    if request.method == 'POST':
        cards_data = json.loads(request.body)
        
        for item in cards_data:
            card_front = item.get('front')
        
            if card_front:
                card = get_object_or_404(Card, front=card_front, deck=deck)
                card.learnt = item.get('learnt')
                card.i = item.get('i')
                card.n = item.get('n')
                card.constant_i = item.get('constant_i')
                                
                interval_calc = card.constant_i*card.i
                card.i = round(interval_calc)
                
                if card.n == 0:
                    card.i = 1;
                
                n_date = card.review_date + timedelta(days=round(card.i))
                card.review_date = n_date

                card.save()
            else:
                return JsonResponse({"message": "Data failed to save"}, status=400)
        return JsonResponse({"message": "Data successfully saved"})