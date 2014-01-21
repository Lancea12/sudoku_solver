from django.db import models
from django.dispatch import receiver
import logging

class User(models.Model):
  name = models.CharField(max_length=255)

  logger = logging.getLogger('solver')

  class Meta:
    app_label = "solver"

  

