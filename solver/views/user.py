from django.http import HttpResponse
from django.http import HttpResponseForbidden
from django.template import RequestContext, loader
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.contrib import auth
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from solver.controllers.util import Util
import logging

from solver.models.board import Board

logger = logging.getLogger('solver')

def user_check(request, id):
  if(request.user.id != int(id)):
    template = loader.get_template('forbidden.html')
    return HttpResponseForbidden(template.render(RequestContext(request, {})))
  return None


@login_required
def index(request, id=-1):
  if(id == -1):
    user = request.user
  else:
    check = user_check(request, id)
    if(check != None):
      return check
    user = User.objects.get(id=id)
  template = loader.get_template('index.html')
  context = RequestContext(request, {'my_boards' : user.board_set.values(), 
                                     'shared_boards' : user.shared_with_me.values()})
  return HttpResponse(template.render(context))

def login(request):
  if(request.method == "PUT" or request.method == "POST"):
    #logger.debug(request.POST.keys())
    #logger.debug(request.POST.values())
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
  client_id = Util.get_client_secrets()['client_id']
  context = RequestContext(request, {'client_id' : client_id})
  return HttpResponse(template.render(context))

def logout(request):
  auth.logout(request)
  return redirect('https://accounts.google.com/logout') 
