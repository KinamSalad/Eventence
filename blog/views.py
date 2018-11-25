from django.shortcuts import render
from django.utils import timezone
from .models import Post
from .models import CustomUser
from .models import GradeInfo, MajorInfo, Keyword
from django.shortcuts import render, get_object_or_404
from .forms import PostForm, KeywordForm
from django.shortcuts import redirect
from .forms import CustomUserCreationForm
from django.views import generic
from django.urls import reverse_lazy
from django.http import HttpResponse
import json
import random
from random import randint
# -*- encoding:utf8 -*-
import os
from collections import Counter
import pytagcloud
import sys
from django.conf import settings

def hello(request):
    return render(request, 'blog/hello.html')


def post_list(request):
    user = None
    if request.user.is_authenticated():
        user = request.user
    
    posts = Post.objects.filter().order_by('-time')
    
    for post in posts:

        g_info = GradeInfo.objects.filter(post=post).order_by('-value')[0]
        m_info = MajorInfo.objects.filter(post=post).order_by('-value')[0]

        if g_info.value == 0:
            post.grade1 = "None"
        else:
            post.grade1 = g_info.key

        if m_info.value == 0:
            post.major1 = "None"
        else:
            post.major1 = m_info.key
        

        temp = Keyword.objects.filter(post=post)
        length = len(temp)

        if length > 0:
            index = randint(0, length-1)
            indexKeyword = randint(0, 1)

            if indexKeyword == 0:
                post.keywordrand = temp[index].keyword1
                post.keyword_prefix = post.keyword1_prefix
                post.keyword_suffix = post.keyword1_suffix

            else:
                post.keywordrand = temp[index].keyword2
                post.keyword_prefix = post.keyword2_prefix
                post.keyword_suffix = post.keyword2_suffix
        else:
            post.keywordrand = ""
            post.keyword_prefix = "Waiting your sentence..."
            post.keyword_suffix = ""

        post.save()

    return render(request, 'blog/post_list.html', {'posts': posts, 'user': user })

def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    
    g_info = GradeInfo.objects.filter(post=post).order_by('-value')[0]
    m_info = MajorInfo.objects.filter(post=post).order_by('-value')[0]

    if g_info.value == 0:
        post.grade1 = "None"
    else:
        post.grade1 = g_info.key

    if m_info.value == 0:
        post.major1 = "None"

    wordlist = []
    key = Keyword.objects.filter(post=post)
    for i in key:
        wordlist.append(i.keyword1)
        wordlist.append(i.keyword2)
    count = Counter(wordlist)
    tag2 = count.most_common(30)
    taglist = pytagcloud.make_tags(tag2, maxsize=30)
    path = settings.BASE_DIR+"/blog/static/wordcloud/wordcloud_"+str(post)+".png"  
    path_html = "../../static/wordcloud/wordcloud_"+str(post)+".png"
    pytagcloud.create_tag_image(taglist, path, size=(500, 500), rectangular=False)

    if request.method == "POST":
        form = KeywordForm(request.POST)
        if form.is_valid():
            keyword = form.save(commit=False)
            keyword.post = post
            keyword.save()
            return redirect('post_cat', pk=post.pk)
        #else: #ERROR
        #   return redirect('post_cat', pk=post.pk)
    else:
        form = KeywordForm()        
    return render(request, 'blog/post_detail.html', {'post': post, 'form': form, 'path': path_html})

def post_new(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.published_date = timezone.now()
            post.save()
            # Make gradeinfo model
            a = GradeInfo(id=None, post=post,key="Junior", value=0)
            a.save()
            a = GradeInfo(id=None, post=post,key="Senior", value=0)
            a.save()
            a = GradeInfo(id=None, post=post,key="Ms", value=0)
            a.save()
            a = GradeInfo(id=None, post=post,key="PhD", value=0)
            a.save()

            #Make majorinfo model
            a = MajorInfo(id=None, post=post,key="CE", value=0)
            a.save()
            a = MajorInfo(id=None, post=post,key="MSB", value=0)
            a.save()
            a = MajorInfo(id=None, post=post,key="ME", value=0)
            a.save()
            a = MajorInfo(id=None, post=post,key="PH", value=0)
            a.save()
            a = MajorInfo(id=None, post=post,key="BIS", value=0)
            a.save()
            a = MajorInfo(id=None, post=post,key="IE", value=0)
            a.save()
            a = MajorInfo(id=None, post=post,key="ID", value=0)
            a.save()
            a = MajorInfo(id=None, post=post,key="BS", value=0)
            a.save()
            a = MajorInfo(id=None, post=post,key="MAS", value=0)
            a.save()
            a = MajorInfo(id=None, post=post,key="EE", value=0)
            a.save()
            a = MajorInfo(id=None, post=post,key="CS", value=0)
            a.save()
            a = MajorInfo(id=None, post=post,key="AE", value=0)
            a.save()
            a = MajorInfo(id=None, post=post,key="CH", value=0)
            a.save()
            a = MajorInfo(id=None, post=post,key="CBE", value=0)
            a.save()
            a = MajorInfo(id=None, post=post,key="MS", value=0)
            a.save()
            a = MajorInfo(id=None, post=post,key="ETC", value=0)
            a.save()

            return redirect('post_detail', pk=post.pk)
    else:
        form = PostForm()
    return render(request, 'blog/post_edit.html', {'form': form})

def post_edit(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == "POST":
        form = PostForm(request.POST,instance=post)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.published_date = timezone.now()
            post.save()
            return redirect('post_detail', pk=post.pk)
    else:
        form = PostForm(instance=post)
    return render(request, 'blog/post_edit.html', {'form': form})

def post_remove(request, pk):
    post = get_object_or_404(Post, pk=pk)
    GradeInfo.objects.filter(post = post).delete()
    MajorInfo.objects.filter(post= post).delete()
    Keyword.objects.filter(post= post).delete()
    path = settings.BASE_DIR+"/blog/static/wordcloud/wordcloud_"+str(post)+".png"
    if os.path.exists(path):
        os.remove(path)
    post.delete()

    return redirect('post_list')

class sign_up(generic.CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'blog/sign_up.html'


#like 기능
def post_like(request):
    pk = request.POST.get('pk', None) # ajax 통신을 통해서 template에서 POST방식으로 전달
    post = get_object_or_404(Post, pk=pk)
    post_like, post_like_created = post.like_set.get_or_create(user=request.user)
   

    if not post_like_created:
        post_like.delete()
        message = "like canceled"

        gradeinfo = GradeInfo.objects.get(post=post, key=request.user.grade)
        gradeinfo.value = gradeinfo.value - 1
        gradeinfo.save()
        majorinfo = MajorInfo.objects.get(post=post, key=request.user.major)
        majorinfo.value = majorinfo.value - 1
        majorinfo.save()
    else:
        message = "like"
        gradeinfo = GradeInfo.objects.get(post=post, key=request.user.grade)
        gradeinfo.value = gradeinfo.value + 1
        gradeinfo.save()
        majorinfo = MajorInfo.objects.get(post=post, key=request.user.major)
        majorinfo.value = majorinfo.value + 1
        majorinfo.save()

    g_info = GradeInfo.objects.filter(post=post).order_by('-value')[0]
    m_info = MajorInfo.objects.filter(post=post).order_by('-value')[0]

    if g_info.value == 0:
        grade1 = "None"
    else:
        grade1 = g_info.key

    if m_info.value == 0:
        major1 = "None"
    else:
        major1 = m_info.key


    context = { 'like_count': post.like_count(),
                'message': message,
                'nickname': request.user.username, 
                'grade1': grade1,
                'major1': major1 }

    return HttpResponse(json.dumps(context))

def keyword_reset(request):
    pk = request.POST.get('pk', None)
    post = get_object_or_404(Post, pk=pk)
    
    temp = Keyword.objects.filter(post=post)
    length = len(temp)

    if length > 0:
        index = randint(0, length-1)
        indexKeyword = randint(0, 1)
        if indexKeyword == 0:
            keywordrand = temp[index].keyword1
            keyword_prefix = post.keyword1_prefix
            keyword_suffix = post.keyword1_suffix
        
        else:
            keywordrand = temp[index].keyword2
            keyword_prefix = post.keyword2_prefix
            keyword_suffix = post.keyword2_suffix
    else:
        keywordrand = ""
        keyword_prefix = "Waiting your sentence..."
        keyword_suffix = ""
    
    context = { 'keyword': keywordrand,
                'prefix': keyword_prefix,
                'suffix': keyword_suffix }
    
    return HttpResponse(json.dumps(context))

def post_cat(request, pk):
    post = get_object_or_404(Post, pk=pk)
    index = randint(1, 10)
    path = "../../static/images/cat_"+str(index)+ ".jpg"
    return render(request, 'blog/post_cat.html', {'post': post, 'path': path})

def post_result(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'blog/post_result.html', {'post': post})

def esc(request):
    return render(request, 'blog/esc.html')

def really_remove(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'blog/really_remove.html', {'post': post})












