from django.http import HttpResponse
from django.template import RequestContext, loader
from django.dispatch import receiver
from django.db.models.signals import post_save
import json

from solver.models.board import Board
from solver.models.user import User

def show(request, user_id, board_id):
  if(request.method == "PUT" or request.method == "POST"):
    return create_or_update(request, user_id, board_id)
  (user, created) = User.objects.get_or_create(id=user_id)
  (board,created) = user.board_set.get_or_create(id=board_id)
  return HttpResponse(json.dumps({'user_id' : user_id, 'board' : board.context()}))

def create(request, user_id):
  (user, created) = User.objects.get_or_create(id=user_id)
  board = user.board_set.create(user=user)
  return update_helper(request, user, board)

def update(request, user_id, board_id):
  (user, created) = User.objects.get_or_create(id=user_id)
  (board, created) = user.board_set.get_or_create(user=user, id=board_id)
  return update_helper(request, user, board)
  

def update_helper(request, user, board):
  data = json.loads(request.POST['board'])
  if(data == None):
    return HttpResponse("failed json load")
  saved = board.update(data)
  return HttpResponse(json.dumps({
     'saved': saved, 'user_id': user.id, 'board_id': board.id
  }))
  

def list(request, user_id):
  if(request.method == "PUT" or request.method == "POST"):
    return create_or_update(request, user_id, None)
  (user, created) = User.objects.get_or_create(id=user_id)
  boards = user.board_set.all()
  user_context = {'user_id' : user_id, 
                  'boards' : [{'name' : b.name, 'id' : b.id} for b in boards]
                 }
  return HttpResponse(json.dumps(user_context))


def index(request, user_id, board_id=-1):
  template = loader.get_template('board.html')
  context = RequestContext(request, {'user_id' : user_id, 'board_id': board_id})
  return HttpResponse(template.render(context))

def delete(request, id):
  b = Board.objects.get(id=int(id))
  if(b != None):
    b.delete()
  return HttpResponse(json.dumps({'deleted': True, 'id': int(id)}))


