from flask import Flask, request, redirect
from flask_login import current_user, login_user
import json

from server.app import app
from . import user_login

@app.route('/login', methods=['POST'])
def login():
    if current_user.is_authenticated:
        return redirect('/')
    ul = user_login.get_by_username(request.json.get('username'))
    if ul is None or not ul.check_password(request.json.get('password')):
        return "Login failed", 401
    login_user(ul)
    return { "data": ul.get_display() }, 200
