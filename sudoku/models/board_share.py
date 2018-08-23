from .board import Board
import math
import logging

class Board_Share(models.Model):
  board = models.ForeignKey(Board)
  guest = models.ForeignKey(User)
  writable = models.BooleanField()

  logger = logging.getLogger('solver')

  class Meta:
    app_label = "solver"

