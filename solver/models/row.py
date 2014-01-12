from django.http import HttpResponse
from django.db import models
from solver.models.board import Board
import logging

class Row(models.Model):
  board = models.ForeignKey(Board)
  row_index = models.IntegerField()

  logger = logging.getLogger('solver')

  class Meta:
    app_label = "solver"

  def context(self):
    return {'row_index' : self.row_index,
            'cells' : [cell.context() for cell in self.cell_set.extra(order_by = ['cell_index'])]
           }

  def update(self, data):
    cell_data = data['cells']
    self.logger.debug('data len=%d cells len=%d' %(len(cell_data), len(self.cell_set.all()))) 
    for cell in self.cell_set.extra(order_by = ['cell_index']):
      if(not cell.update(cell_data.__getitem__(cell.cell_index))):
        return False
    self.save()
    return True
    
