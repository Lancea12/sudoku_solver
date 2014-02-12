from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()


urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'sudoku_solver.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'solver.views.index.index'),
    url(r'^accounts/login/$', 'solver.views.user.auth'),
    url(r'^user/(?P<id>\d*)/$', 'solver.views.user.index'),
    url(r'^user/(?P<user_id>\d*)/board.html/(?P<board_id>\d*)/$', 'solver.views.board.index'),
    url(r'^user/(?P<user_id>\d*)/board.html$', 'solver.views.board.index'),
    url(r'^user/(?P<user_id>\d*)/board/$', 'solver.views.board.list'),
    url(r'^user/(?P<user_id>\d*)/board/create/$', 'solver.views.board.create'),
    url(r'^user/(?P<user_id>\d*)/board/(?P<board_id>\d*)/$', 'solver.views.board.update'),
    url(r'^user/(?P<user_id>\d*)/board.json/(?P<board_id>\d*)/$', 'solver.views.board.show'),
    url(r'^board/delete/(?P<id>\d*)/$', 'solver.views.board.delete'),
)


