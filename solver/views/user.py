from django.http import HttpResponse
from django.template import RequestContext, loader
from django.dispatch import receiver
from django.db.models.signals import post_save
from solver.models.user import User
import json

from solver.models.board import Board

def index(request, id):
    template = loader.get_template('index.html')
    (user, created) = User.objects.get_or_create(id=id)
    context = RequestContext(request, {'board_list' : user.board_set.values()})
    return HttpResponse(template.render(context))

