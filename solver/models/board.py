from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
import math
import logging

class Board(models.Model):
  user = models.ForeignKey(User)
  name = models.CharField(max_length=255)
  anchored = models.BooleanField(default=False)

  logger = logging.getLogger('solver')

  class Meta:
    app_label = "solver"
    

  def context(self):
    return {'name' : self.name,
            'id' : self.id,
            'anchored' : self.anchored,
            'rows' : [row.context() for row in self.row_set.extra(order_by = ['row_index'])]
           }

  def update(self, data):
    self.logger.debug('updating board')
    self.name = data['name']
    self.anchored = data['anchored']
    row_data = data['rows']
    for row in self.row_set.extra(order_by = ['row_index']):
      self.logger.debug(row.row_index)
      if(not row.update(row_data.__getitem__(row.row_index))):
        return False
    self.save()
    return True
    



@receiver(post_save, sender=Board)
def build_board(sender, instance, **kwargs):
  if not kwargs['created']:
    return
  from solver.models.row import Row
  from solver.models.cell import Cell

  for num in range(0,9):
    instance.row_set.create(row_index=num)

  for row in instance.row_set.all():
    for index in range(0,9):
      Cell.objects.create(row=row, cell_index=index)

