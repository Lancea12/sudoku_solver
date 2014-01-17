from django.http import HttpResponse
from django.template import RequestContext, loader
from django.dispatch import receiver
from django.db.models.signals import post_save
import json

from solver.models.board import Board

def get(request, id):
  if(request.method == "PUT" or request.method == "POST"):
    return create_or_update(request, id)
  (board, created) = Board.objects.get_or_create(id=id)
  return HttpResponse(json.dumps({'board' : board.context()}))

def create_or_update(request, id):
  if(id != None):
    (board, created) = Board.objects.get_or_create(id=id)
  else:
    board = Board.objects.create()
    id = board.id

  data = json.loads(request.POST['board'])
  
  if(data == None):
    return HttpResponse("failed json load")
  saved = board.update(data)
  return HttpResponse(json.dumps({'saved': saved, 'id': int(id)}))
  

def list(request):
  if(request.method == "PUT" or request.method == "POST"):
    return create_or_update(request, None)
  boards = Board.objects.all()
  return HttpResponse(json.dumps([{'name' : b.name, 'id' : b.id} for b in boards]))


def index(request, id=-1):
  template = loader.get_template('board.html')
  context = RequestContext(request, {'id': id})
  return HttpResponse(template.render(context))

def delete(request, id):
  b = Board.objects.get(id=int(id))
  if(b != None):
    b.delete()
  return HttpResponse(json.dumps({'deleted': True, 'id': int(id)}))


