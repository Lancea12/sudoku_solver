from django.http import HttpResponse
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from solver.models.row import Row
from solver.models.column import Column
from solver.models.tic import Tic
import logging

class Cell(models.Model):
  row = models.ForeignKey(Row)
  cell_index = models.IntegerField()
  anchored = models.BooleanField(default=False)
  
  logger = logging.getLogger('solver')

  class Meta:
    app_label = "solver"

  def context(self):
    return {'cell_index' : self.cell_index,
            'anchored' : self.anchored,
            'choices' : [c.val for c in self.choice_set.all()],
           }

  def update(self, data):
    choice_data = data['choices']
    self.anchored = data['anchored']
    self.logger.debug('setting anchored: %r' % self.anchored)
    for choice_val in range(1,10):
      if(choice_val in choice_data):
        self.logger.debug('adding choice: %d to row %d col %d' % (choice_val, self.row.row_index, self.cell_index))
        self.choice_set.get_or_create(val=choice_val)
      else:
        filtered_choices = self.choice_set.filter(val=choice_val)
        if len(filtered_choices) > 0:
          self.logger.debug('removing choice: %d' % (choice_val))
          filtered_choices.delete() 
    self.save()
    return True
    

