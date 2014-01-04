from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
import math

class Board(models.Model):

  class Meta:
    app_label = "solver"

  def context(self):
    return [row.context() for row in self.row_set.all()]


@receiver(post_save, sender=Board)
def build_board(sender, instance, **kwargs):
  if not kwargs['created']:
    return
  from solver.models.row import Row
  from solver.models.cell import Cell

  for num in range(0,9):
    instance.row_set.create(row_num=num)

  for row in instance.row_set.all():
    for column in instance.column_set.all():
      Cell.objects.create(row=row)

