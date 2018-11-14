from django.conf.urls import url
from . import views


urlpatterns = [
	url(r'^$', views.hello, name= 'hello'),
	url(r'^sign_up/$', views.sign_up.as_view(), name= 'sign_up'),
    url(r'^post_list/$', views.post_list, name='post_list'),
    url(r'^post/(?P<pk>\d+)/$', views.post_detail, name='post_detail'),
    url(r'^post/new/$', views.post_new, name='post_new'),
    url(r'^post/(?P<pk>\d+)/edit/$', views.post_edit, name='post_edit'),
    url(r'^post/(?P<pk>\d+)/remove/$', views.post_remove, name='post_remove'),
    url(r'^like/$', views.post_like, name='post_like'), #like operation
    url(r'^reset/$', views.keyword_reset, name='keyword_reset'), #keyword reset operation
    url(r'^post/(?P<pk>\d+)/cat$', views.post_cat, name='post_cat'),
    url(r'^post/(?P<pk>\d+)/result$', views.post_result, name='post_result')
]