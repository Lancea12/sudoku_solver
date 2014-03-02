import json
import logging


CLIENT_SECRETS = 'client_secrets.json'

class Util(object):

  logger = logging.getLogger('solver')

  @staticmethod
  def get_client_secrets():
    with open(CLIENT_SECRETS, 'rb') as f:
      return json.loads(f.read())['web']

