from django.db import models
from solver.models.cell import Cell

class Choice(models.Model):
  cell = models.ForeignKey(Cell)
  val = models.IntegerField()

  class Meta:
    app_label = "solver"
