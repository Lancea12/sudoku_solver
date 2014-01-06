from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from solver.models.row import Row
from solver.models.column import Column
from solver.models.tic import Tic

class Cell(models.Model):
  row = models.ForeignKey(Row)
  cell_index = models.IntegerField()
  

  class Meta:
    app_label = "solver"

  def context(self):
    return {'cell_index' : self.cell_index,
            'choices' : [c.val for c in self.choice_set.all()]
           }

