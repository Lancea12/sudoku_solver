#!/usr/bin/env python

import sys

from http.server import HTTPServer, SimpleHTTPRequestHandler

def run(port=8080, server_class=HTTPServer, handler_class=SimpleHTTPRequestHandler):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()


if __name__ == '__main__':
    port = 8080
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    print('running on: {}'.format(port))
    run(port)
