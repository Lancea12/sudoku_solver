from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
import math

class Board(models.Model):
  name = models.CharField(max_length=255)

  class Meta:
    app_label = "solver"

  def context(self):
    return {'name' : self.name,
            'rows' : row.context() for row in self.row_set.all()]
           }


@receiver(post_save, sender=Board)
def build_board(sender, instance, **kwargs):
  if not kwargs['created']:
    return
  from solver.models.row import Row
  from solver.models.cell import Cell

  for num in range(0,9):
    instance.row_set.create(row_index=num)

  for row in instance.row_set.all():
    for index in range(0,10):
      Cell.objects.create(row=rowi, cell_index=index)

