from django.db import models
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.contrib.auth.models import UserManager
from oauth2client.django_orm import CredentialsField
from oauth2client.client import flow_from_clientsecrets
from oauth2client.client import verify_id_token
from oauth2client.client import credentials_from_client_secrets_and_code
from oauth2client.client import FlowExchangeError
from oauth2client.django_orm import Storage
from apiclient.discovery import build
import logging
import httplib2
import json
import base64
import jwt

class Solver_Auth_Backend(object):

  logger = logging.getLogger('solver')
  
  def authenticate(self, token=None):
    self.logger.debug('authenticating')
    code = token['code']
    client_secrets = self.get_client_secrets()
    id_token = verify_id_token(token['id_token'], client_secrets['client_id'])
    try:
      user = User.objects.get(id=id_token['sub'])
      return user
    except e:
      logger.debug(e)
 
      return self.create_user(code, id_token)
    
    

  def get_client_secrets():
    f = open('client_secret.json', 'r')
    return json.loads(f.read()) 
    

  
  def create_user(self, code, id_token):
    client_secrets = self.get_client_secrets()
    client_id = clients_secrets['client_id']
    client_secret = clients_secrets['client_secret']
    credential = credentials_from_code(client_id, client_secret,
      'https://www.googleapis.com/auth/plus.me', code, 'No client secrets file')
      

    google_user_info = get_google_user_info(credential)
    return 'login not successfull yet'
    user = UserManager.create_user()
    account_info = Account_Info.objects.create(user=user, google_id=google_id)
  
  
  def get_google_user_info(credential):
    http = httplib2.Http()
    http = credential.authorize(http)
    service = build("plus", "v1", http=http)
    google_id = credential.id_token['sub']
    logger.debug('google id: "%s"' % (google_id))
    people = service.people()
    google_user_info = people.get(userId='me').execute()
    logger.debug('info: %s' % (google_user_info.keys()))
    return google_user_info
  
  
  def get_credentials_from_code(code, id_token):
    google_id = id_token['sub']
    try:
      # Upgrade the authorization code into a credentials object
      oauth_flow = flow_from_clientsecrets('client_secrets.json', 
                    scope='https://www.googleapis.com/auth/plus.me')
      oauth_flow.redirect_uri = 'postmessage'
      credential = oauth_flow.step2_exchange(code)
    except FlowExchangeError:
      return None
  
    # Check that the access token is valid.
    access_token = credential.access_token
    url = ('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=%s'
           % access_token)
    h = httplib2.Http()
    result = json.loads(h.request(url, 'GET')[1])
    # If there was an error in the access token info, abort.
    if result.get('error') is not None:
      return None
    # Verify that the access token is used for the intended user.
    
    if result['user_id'] != google_id:
      return None
    # Verify that the access token is valid for this app.
    if result['issued_to'] != oauth_flow.client_id:
      return None
  
    return credential
