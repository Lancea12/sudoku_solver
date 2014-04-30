from django.db import models
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.contrib.auth.models import UserManager
from oauth2client.django_orm import CredentialsField
from oauth2client.client import flow_from_clientsecrets
from oauth2client.client import FlowExchangeError
from oauth2client.django_orm import Storage
from apiclient.discovery import build
from solver.models.board import Board
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

  
  def is_writable(self, board_id):
    board_id = int(board_id)
    if(board_id == -1):
      return False
    self.logger.debug(dir(self.user))
    if(len(self.user.board_set.filter(id=board_id)) > 0):
      return True
    elif(len(self.user.shared_with_me.filter(id=board_id)) > 0):
      board = self.user.shared_with_me.get(id=int(board_id))
      board_share = self.user.board_share_set.get(board=board)
      return board_share.writable
    else:
      return False
  
  
