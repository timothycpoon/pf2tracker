import time
from flask import Flask
from .app import app

@app.route('/api/test')
def get_current_time():
    return {'time': time.time()}
