from django.db import models
from solver.models.board import Board

class Row(models.Model):
  board = models.ForeignKey(Board)
  row_index = models.IntegerField()
  cells_left = models.IntegerField(default=9)

  class Meta:
    app_label = "solver"

  def context(self):
    return {'row_index' : self.row_index,
            'cells' : [cell.context() for cell in self.cell_set.all()]
           }
