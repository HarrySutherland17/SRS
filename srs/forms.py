from django import forms
from .models import Deck, Card, User

class DeckForm(forms.ModelForm):
    class Meta:
        model = Deck
        fields = ['name']
        widgets = {
            'name' : forms.TextInput(attrs={'class': 'form-control'})
        }
        
class CardForm(forms.ModelForm):
    class Meta:
        model = Card
        fields = ['front', 'back', 'deck']
        widgets = {
            'front': forms.TextInput(attrs={'class': 'form-control'}),
            'back': forms.TextInput(attrs={'class': 'form-control'}),
            'deck': forms.Select(attrs={'class': 'form-control'}),
        }
    def __init__(self, user, *args, **kwargs):
        super(CardForm, self).__init__(*args, **kwargs)
        self.fields['deck'].queryset = Deck.objects.filter(user=user)
    
        