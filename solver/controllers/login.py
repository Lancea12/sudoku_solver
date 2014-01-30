from oauth2client.client import flow_from_clientsecrets
from oauth2client.client import FlowExchangeError
from oauth2client.django_orm import Storage
from apiclient.discovery import build
from django.contrib.auth.models import User
from django.contrib.auth.models import UserManager
from solver.models.account_info import Account_Info
import httplib2
import json
import logging
import base64

logger = logging.getLogger('solver')

def do_login(code, id_token):
  id_token = decode_id_token(id_token)
  google_id = id_token['sub']
  account_info_list = Account_Info.objects.filter(google_id=google_id)


  if(account_info_list.exists()):
    account_info = account_info_list.first()
    user = account_info.user
  else:
  storage = Storage(Account_Info, 'user', user, 'credential')


  logger.debug('id_token from creds: %s' % (','.join(dir(storage.get().id_token))))
  return 'login successful'


def authenticate_and_create_user(code, id_token):
    credential = get_credentials_from_code(code, id_token)
    google_user_info = get_google_user_info(credential)
    return 'login not successfull yet'
    user = UserManager.create_user()
    account_info = Account_Info.objects.create(user=user, google_id=google_id)


def decode_id_token(id_token):
  return json.loads(base64.b64decode(id_token.split('.')[1])) 

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
