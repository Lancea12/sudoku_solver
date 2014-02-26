from django.http import HttpResponse
from django.template import RequestContext, loader
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
import json

from solver.models.board import Board

@login_required
def index(request):
    return redirect('solver.views.user.index', id=request.user.id)

    
