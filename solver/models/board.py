from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
import math

class Board(models.Model):
  rows_left = models.IntegerField(default=9)
  columns_left = models.IntegerField(default=9)
  tics_left = models.IntegerField(default=9)

  class Meta:
    app_label = "solver"

  def context(self):
    return [row.context() for row in self.row_set.all()]


@receiver(post_save, sender=Board)
def build_board(sender, instance, **kwargs):
  if not kwargs['created']:
    return
  from solver.models.row import Row
  from solver.models.column import Column
  from solver.models.tic import Tic
  from solver.models.cell import Cell

  for num in range(1,10):
    instance.row_set.create(row_num=num)
    instance.column_set.create(col_num=num)
    instance.tic_set.create(tic_num=num)

  for row in instance.row_set.all():
    for column in instance.column_set.all():
      tic_num = calc_tic_num(row.row_num, column.col_num)
      tic = instance.tic_set.get(tic_num=tic_num)
      Cell.objects.create(row=row, column=column, tic=tic)

def calc_tic_num(row_num, col_num):
  tic_num = row_num - ((row_num - 1)% 3) - 1 + math.ceil(col_num / 3)
  return tic_num 
