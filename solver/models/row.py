from django.db import models
from solver.models.board import Board

class Row(models.Model):
  board = models.ForeignKey(Board)
  row_num = models.IntegerField()
  cells_left = models.IntegerField(default=9)

  class Meta:
    app_label = "solver"

  def context(self):
    return [cell.context() for cell in self.cell_set.all()]
