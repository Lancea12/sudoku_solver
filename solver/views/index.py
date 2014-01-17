from django.http import HttpResponse
from django.template import RequestContext, loader
from django.dispatch import receiver
from django.db.models.signals import post_save
import json

from solver.models.board import Board

def index(request):
    template = loader.get_template('index.html')
    context = RequestContext(request, {'board_list' : Board.objects.values()})
    return HttpResponse(template.render(context))

