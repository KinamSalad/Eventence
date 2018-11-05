from django import forms
from .models import Post
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser

class PostForm(forms.ModelForm):

    class Meta:
        model = Post
        fields = ('title', 'time', 'place')


class CustomUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm):
    	model = CustomUser
    	fields = ('username', 'email', 'grade', 'major')




class CustomUserChangeForm(UserChangeForm):

    class Meta:
    	model = CustomUser
    	fields = ('username', 'email', 'grade', 'major')