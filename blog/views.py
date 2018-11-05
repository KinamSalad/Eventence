from django.shortcuts import render
from django.utils import timezone
from .models import Post
from django.shortcuts import render, get_object_or_404
from .forms import PostForm
from django.shortcuts import redirect
from .forms import CustomUserCreationForm
from django.views import generic
from django.urls import reverse_lazy

def hello(request):
	return render(request, 'blog/hello.html')


def post_list(request):
	posts = Post.objects.filter().order_by('time')
	return render(request, 'blog/post_list.html', {'posts': posts})

def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'blog/post_detail.html', {'post': post})

def post_new(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.published_date = timezone.now()
            post.save()
            return redirect('post_detail', pk=post.pk)
    else:
        form = PostForm()
    return render(request, 'blog/post_edit.html', {'form': form})

def post_edit(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == "POST":
        form = PostForm(instance=post)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.published_date = timezone.now()
            post.save()
            return redirect('post_detail', pk=post.pk)
    else:
        form = PostForm(instance=post)
    return render(request, 'blog/post_edit.html', {'form': form})

class sign_up(generic.CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'blog/sign_up.html'


#def sign_up(request):
#	if request.method == 'POST':
#		form = CustomUserCreationForm(instance = post)
#		print(form)
#		if form.is_valid():
#			post = form.save(commit = False)
#			post.save()
#	else:
#		form = CustomUserCreationForm()
#	return render(request, 'blog/sign_up.html', {'form': form})











