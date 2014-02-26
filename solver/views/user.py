from django.http import HttpResponse
from django.template import RequestContext, loader
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.contrib import auth
from django.shortcuts import redirect
import logging

from solver.models.board import Board

logger = logging.getLogger('solver')

def index(request, id):
  template = loader.get_template('index.html')
  (user, created) = User.objects.get_or_create(id=id)
  context = RequestContext(request, {'board_list' : user.board_set.values()})
  return HttpResponse(template.render(context))

def login(request):
  if(request.method == "PUT" or request.method == "POST"):
    logger.debug(request.POST.keys())
    logger.debug(request.POST.values())
    if(request.POST.has_key('code') and 
      #request.POST.has_key('login_method') and 
      #request.POST['login_method'] == 'PROMPT' and
      request.POST.has_key('id_token')):

      user = auth.authenticate(token=request.POST)
      if(user != None):
        auth.login(request, user)
      return HttpResponse(user)
    elif(request.POST.has_key('login_method') and 
      request.POST['login_method'] == 'AUTO'):
      return HttpResponse("error: attempt to auto login")
    else:
      return HttpResponse("error: code or id_token missing")
    
  template = loader.get_template('login.html')
  context = RequestContext(request, {})
  return HttpResponse(template.render(context))

def logout(request):
  auth.logout(request)
  return redirect('https://accounts.google.com/logout') 
