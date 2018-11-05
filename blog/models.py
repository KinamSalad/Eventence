from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class CustomUser(AbstractUser):
    # add additional fields in here
    grade = models.CharField(max_length = 10, default = "")
    major = models.CharField(max_length = 5, default = "")
    #major = models.ChoiceField(widget = forms.Select(), choices = grade_form, initial = '3')
    def __str__(self):
        return self.email
        
class Post(models.Model):
    #author = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    post_id =  models.IntegerField(blank=True, null=True)# can remove
    title = models.CharField(max_length=100)
    time = models.CharField(max_length=100, default = "")
    place = models.CharField(max_length=100, default = "")

    created_date = models.DateTimeField(
            default=timezone.now)
    published_date = models.DateTimeField(
            blank=True, null=True)

    def publish(self):
        self.published_date = timezone.now()
        self.save()

    def __str__(self):
        return self.title


class Keyword_info(models.Model):
	post_id = models.IntegerField(blank=True, null=True)
	keyword = models.CharField(max_length = 200)

class Keyword_rewards(models.Model):
	post_id = models.IntegerField(blank=True, null=True)
	keyword = models.CharField(max_length = 200)

#class Images(models.Model):




# Create your models here.
