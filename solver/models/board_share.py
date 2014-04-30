from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from solver.models.board import Board
import math
import logging

class Board_Share(models.Model):
  board = models.ForeignKey(Board)
  guest = models.ForeignKey(User)
  writable = models.BooleanField()

  logger = logging.getLogger('solver')

  class Meta:
    app_label = "solver"

