from django.http import HttpResponse
from django.template import RequestContext, loader
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
import logging

from solver.models.board import Board

def index(request, id):
  template = loader.get_template('index.html')
  (user, created) = User.objects.get_or_create(id=id)
  context = RequestContext(request, {'board_list' : user.board_set.values()})
  return HttpResponse(template.render(context))

def login(request):
  if(request.method == "PUT" or request.method == "POST"):
    if(request.POST.has_key('code') and request.POST.has_key('id_token')):
      user = authenticate(token=request.POST)
      return HttpResponse(user)
    
  template = loader.get_template('login.html')
  context = RequestContext(request, {})
  return HttpResponse(template.render(context))
