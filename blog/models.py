from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.conf import settings

class CustomUser(AbstractUser):
    # add additional fields in here
    grade = models.CharField(max_length = 10, default = "")
    major = models.CharField(max_length = 5, default = "")
    #major = models.ChoiceField(widget = forms.Select(), choices = grade_form, initial = '3')
    def __str__(self):
        return self.email
        

class Post(models.Model):
    title = models.CharField(max_length=100)
    time = models.CharField(max_length=40, default = "")
    place = models.CharField(max_length=40, default = "")

    created_date = models.DateTimeField(
            default=timezone.now)
    published_date = models.DateTimeField(
            blank=True, null=True)

    like_user_set = models.ManyToManyField(settings.AUTH_USER_MODEL,
                                        related_name='like_user_set',
                                        through='Like')
    
    grade1 = models.CharField(max_length=10)
    major1 = models.CharField(max_length=5)


    keywordrand = models.CharField(max_length=50)
    keyword_prefix = models.CharField(max_length=50, default = "")
    keyword_suffix = models.CharField(max_length=50, default = "")

    keyword1_prefix = models.CharField(max_length=50, default = "prefix1")
    keyword1_suffix = models.CharField(max_length=50, default = "suffix1")
    keyword2_prefix = models.CharField(max_length=50, default = "prefix2")
    keyword2_suffix = models.CharField(max_length=50, default = "suffix2")


    def like_count(self):
      return self.like_user_set.count()

    def publish(self):
        self.published_date = timezone.now()
        self.save()

    def __str__(self):
        return self.title

class Like(models.Model):
  # ...생략...
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    post = models.ForeignKey(Post)

class GradeInfo(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    key = models.CharField(max_length = 10, default = "")
    value = models.IntegerField(default = 0)


class MajorInfo(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    key = models.CharField(max_length = 5, default = "")
    value = models.IntegerField(default = 0)

class Keyword(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    keyword1 = models.CharField(max_length = 50, default = "")
    keyword2 = models.CharField(max_length = 50, default = "")




#class Images(models.Model):




# Create your models here.
