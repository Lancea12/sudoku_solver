from django.http import HttpResponse
from django.db import models
from solver.models.cell import Cell
from solver.models.board import Board
import logging

class HistoryEntry(models.Model):
  ACTION_CHOICES = (
    ('add', 'add'),
    ('remove', 'remove'),
  )

  board = models.ForeignKey(Board)
  cell = models.ForeignKey(Cell)
  choice = models.IntegerField()
  action = models.CharField(max_length=255, choices=ACTION_CHOICES, default='add')
  loc = models.IntegerField()
  order = models.IntegerField()

  logger = logging.getLogger('solver')

  class Meta:
    app_label = "solver"

  def context(self):
    return {'row_index' : self.cell.row.row_index, 'col_index' : self.cell.cell_index,
            'choice' : self.choice, 'action' : self.action,
           }

