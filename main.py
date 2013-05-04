#!/usr/bin/env python
# -*- encoding: utf-8

import webapp2
class MainHandler(webapp2.RequestHandler):
    def get(self):
        self.error(404)
        self.response.out.write('<h1>404 Not Found</h1>Sorry, nothing here yet')
app = webapp2.WSGIApplication([
    ('/hello', MainHandler),
    ], debug=True)
