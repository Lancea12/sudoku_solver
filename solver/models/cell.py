from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from solver.models.row import Row
from solver.models.column import Column
from solver.models.tic import Tic

class Cell(models.Model):
  row = models.ForeignKey(Row)
  column = models.ForeignKey(Column)
  tic = models.ForeignKey(Tic)
  choices_left = models.IntegerField(default=9)
  

  class Meta:
    app_label = "solver"

  def context(self):
    return {"choices_left" : self.choices_left,
             "choices" : [c.val for c in self.choice_set.all()]}

@receiver(post_save, sender=Cell)
def build_cell(sender, instance, **kwargs):
  if not kwargs['created']:
    return
  from solver.models.choice import Choice

  for num in range(1,10):
    instance.choice_set.create(val=num)

