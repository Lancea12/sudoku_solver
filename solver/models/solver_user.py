from django.db import models
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.contrib.auth.models import UserManager
from oauth2client.django_orm import CredentialsField
from oauth2client.client import flow_from_clientsecrets
from oauth2client.client import FlowExchangeError
from oauth2client.django_orm import Storage
from apiclient.discovery import build
import logging
import httplib2
import json
import base64

class Solver_User_Info(models.Model):
  user = models.OneToOneField(User, primary_key=True)
  google_id = models.CharField(max_length=256)
  credential = CredentialsField()

  logger = logging.getLogger('solver')

  class Meta:
    app_label = "solver"

  
  
