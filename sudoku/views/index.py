from flask import Flask
from flask import render_template

from .. import app

@app.route('/')
def index():
    user = {'first_name': 'Lance', 'last_name': 'Anderson'}
    return render_template('index.html', user=user)

@app.route('/user/<user_id>/board/<board_id>')
@app.route('/new_board')
def board(user_id=None, board_id=None):
    user = {'first_name': 'Lance', 'last_name': 'Anderson'}
    return render_template('board.html', user=user)
