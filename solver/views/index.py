from django.http import HttpResponse
from django.template import RequestContext, loader
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.shortcuts import redirect
import json

from solver.models.board import Board

def index(request):
    return redirect('solver.views.user.index', id=1)

