from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()


urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'sudoku_solver.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'solver.views.index.index'),
    url(r'^board.html$', 'solver.views.board.index'),
    url(r'^board.html/(?P<id>\d*)/$', 'solver.views.board.index'),
    url(r'^board/$', 'solver.views.board.list'),
    url(r'^board.json/(?P<id>\d*)/$', 'solver.views.board.get'),
    url(r'^board/delete/(?P<id>\d*)/$', 'solver.views.board.delete'),
)


