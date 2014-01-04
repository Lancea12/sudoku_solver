from django.http import HttpResponse
from django.template import RequestContext, loader
from django.dispatch import receiver
from django.db.models.signals import post_save
import json

from solver.models.board import Board

def index(request):
    (board, created) = Board.objects.get_or_create(id=1)
    board.save()
    template = loader.get_template('index.html')
    context = RequestContext(request, {'board' : json.dumps(board.context())})
    return HttpResponse(template.render(context))

