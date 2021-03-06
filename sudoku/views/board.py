from .. import app
import json
import logging

from ..models.board import Board
from django.contrib.auth.models import User

logger = logging.getLogger('solver')


# check whether the logged in user can access to the given board_id
# board_id of -1 means new board
def board_check(request, board_id, write=False):
  board_id = int(board_id)

  logger.debug('board id = %d' % board_id)
  if board_id == -1:
    return None

  if len(request.user.board_set.filter(id=board_id)) > 0:
    return None 
  
  if len(request.user.shared_with_me.filter(id=board_id)) > 0 and \
    (not write or request.user.solver_user_info.is_writable(board_id)):
    return None

  template = loader.get_template('forbidden.html')
  return HttpResponseForbidden(template.render(RequestContext(request, {})))

@login_required
def show(request, board_id):
  logger.debug('starting board show')
  check = board_check(request, board_id)
  if check != None:
    return check
  if(request.method == "PUT" or request.method == "POST"):
    return update(request, board_id)
  board = Board.objects.get(id=board_id)
  is_writable = request.user.solver_user_info.is_writable(board_id)
  return HttpResponse(json.dumps({'user_id' : request.user.id, \
      'board' : board.context(), 'writable': is_writable}))

@login_required
def create(request):
  board = request.user.board_set.create(user=request.user)
  return update_helper(request, request.user, board)

@login_required
def update(request, board_id):
  check = board_check(request, board_id, True)
  if check != None:
    return check
  if(request.user.board_set.filter(id=int(board_id))):
    board = request.user.board_set.get(id=int(board_id))
  else:
    board = request.user.shared_with_me.get(id=int(board_id))
    
  return update_helper(request, request.user, board)
  
def update_helper(request, user, board):
  data = json.loads(request.POST['board'])
  if(data == None):
    return HttpResponse("failed json load")
  saved = board.update(data)
  return HttpResponse(json.dumps({
     'saved': saved, 'user_id': request.user.id, 'board_id': board.id
  }))
  

@login_required
def list(request):
  boards = request.user.board_set.all()
  user_context = {'user_id' : request.user.id, 
                  'boards' : [{'name' : b.name, 'id' : b.id} for b in boards]
                 }
  return HttpResponse(json.dumps(user_context))


@app.route('/board.html')
def index(request, board_id=-1):
  check = board_check(request, board_id)
  if check != None:
    return check
  template = loader.get_template('board.html')
  context = RequestContext(request, {'user_id' : request.user.id, 'board_id': board_id})
  return HttpResponse(template.render(context))

@login_required
def delete(request, board_id):
  logger.debug('starting delete')
  check = board_check(request, board_id)
  if check != None:
    return check
  logger.debug('passed check')
  b = request.user.board_set.get(id=int(board_id))
  b.delete()
  return HttpResponse(json.dumps({'deleted': True, 'id': int(board_id)}))


