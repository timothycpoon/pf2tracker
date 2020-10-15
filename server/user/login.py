from flask import Flask, request, redirect
from flask_login import current_user, login_user
import json

from server.app import app
from server.models import UserLogin

@app.route('/login', methods=['POST'])
def login():
    if current_user.is_authenticated:
        return redirect('/')
    ul = UserLogin.query.filter_by(username=request.json.get('username')).first()
    if ul is None or not ul.check_password(request.json.get('password')):
        return "Login failed", 401
    login_user(ul)
    return "Success", 200
