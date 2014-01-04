from django.http import HttpResponse
from django.template import RequestContext, loader
from django.dispatch import receiver
from django.db.models.signals import post_save
import json

from solver.models.board import Board

def get(request, id):
    (board, created) = Board.objects.get_or_create(id=id)
    return HttpResponse(json.dumps({'board' : board.context()}))



