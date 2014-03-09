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
  history_loc = models.IntegerField(default=-1)

  logger = logging.getLogger('solver')

  class Meta:
    app_label = "solver"
    

  def context(self):
    return {'name' : self.name,
            'id' : self.id,
            'anchored' : self.anchored,
            'rows' : [row.context() for row in self.row_set.extra(order_by = ['row_index'])],
            'history' : self.history_context(),
            'history_loc' : self.history_loc
           }

  def history_context(self):
    context = {}
    for e in sorted(self.historyentry_set.all()):
      context[e.order] = e.context()
    return context

  def update(self, data):
    self.logger.debug('updating board')
    history = data['history']
    most_recent = data['most_recent']
    self.history_loc = data['history_loc'] 
    #self.logger.debug(history)
    #self.logger.debug('loc = %d, most recent = %d' % (self.history_loc, most_recent))
     
    self.name = data['name']
    self.anchored = data['anchored']
    row_data = data['rows']
    [e.delete() for e in self.historyentry_set.all()]
    from solver.models.cell import Cell
    for entry_index in sorted(history):
      self.logger.debug('entry = %d' % (int(entry_index)))
      if(int(entry_index) > most_recent):
        break
      entry = history[entry_index]
      cell = Cell.objects.get(row__board=self.id, \
        row__row_index=entry['row_index'], cell_index=entry['col_index'])
      self.historyentry_set.create(cell=cell, choice=entry['choice'], \
        action=entry['action'], loc=entry_index, order=entry_index)
      
    for row in self.row_set.extra(order_by = ['row_index']):
      #self.logger.debug(row.row_index)
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

