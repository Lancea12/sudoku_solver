from django.db import models
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.contrib.auth.models import UserManager
from oauth2client.django_orm import CredentialsField
from oauth2client.client import flow_from_clientsecrets
from oauth2client.client import verify_id_token
from oauth2client.client import credentials_from_code
from oauth2client.client import FlowExchangeError
from oauth2client.django_orm import Storage
from oauth2client.tools import run_flow
from apiclient.discovery import build
from solver.models.solver_user import Solver_User_Info
from solver.controllers.util import Util
import logging
import httplib2
import json
import base64
import jwt

CLIENT_SECRETS = 'client_secrets.json'

class Solver_Auth_Backend(object):

  logger = logging.getLogger('solver')
  
  def authenticate(self, token=None):
    #self.logger.debug('authenticating')
    cs = Util.get_client_secrets()
    #self.logger.debug('cs key: %s' % (cs.keys()) )
    self.logger.debug('client_id = %s' % (cs['client_id']))
    id_token = verify_id_token(str(token['id_token']), str(cs['client_id']))
    try:
      self.logger.debug(id_token['sub'])
      user = User.objects.get(id=str(id_token['sub']))
      self.logger.debug('got user: %s' % user)
      return user
    except:
      return self.create_user(token['code'], id_token)
    
  def create_user(self, code, id_token):
    self.logger.debug('creating user')
    cs = Util.get_client_secrets()
    credential = credentials_from_code(cs['client_id'], cs['client_secret'],
      'https://www.googleapis.com/auth/plus.me', code)
    self.logger.debug('here2')
    google_user_info = self.get_google_user_info(credential)
    self.logger.debug('name: %s' % (google_user_info['name']))
    (user, created) = User.objects.get_or_create(username=str(id_token['sub']),
      first_name=google_user_info['name']['givenName'],
      last_name=google_user_info['name']['familyName'])

    storage = Storage(Solver_User_Info, 'user', user, 'credential')
    self.logger.debug('created storage')
    try:
      storage.put(credential)
    except Exception as e:
      print(e)
    self.logger.debug('stored credntial')
    user.solver_user_info.google_id = id_token['sub']
    user.solver_user_info.save()
    self.logger.debug('added google id')
    return user
  
  
  def get_google_user_info(self, credential):
    http = httplib2.Http()
    http = credential.authorize(http)
    service = build("plus", "v1", http=http)
    self.logger.debug(dir(service))
    google_id = credential.id_token['sub']
    people = service.people()
    google_user_info = people.get(userId='me').execute()
    return google_user_info
  
  
  def get_user(self, user_id):
    try:
      return User.objects.get(pk=user_id)
    except User.DoesNotExist:
      return None
