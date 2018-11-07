from django import forms
from .models import Post, Keyword
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser

class PostForm(forms.ModelForm):

    class Meta:
        model = Post
        fields = ('title', 'time', 'place')

class KeywordForm(forms.ModelForm):

    class Meta:
        model = Keyword
        fields = ('keyword1', 'keyword2')

class CustomUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm):
    	model = CustomUser
    	fields = ('username', 'email', 'grade', 'major')


class CustomUserChangeForm(UserChangeForm):

    class Meta:
    	model = CustomUser
    	fields = ('username', 'email', 'grade', 'major')