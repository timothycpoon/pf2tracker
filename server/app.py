from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

login_manager = LoginManager()
app = Flask(__name__, static_folder='../build', static_url_path='/')
login_manager.init_app(app)
db = SQLAlchemy(app)

from .user import user

@login_manager.user_loader
def load_user(userid):
    return uwer.User.query.get(int(id))

@app.route('/')
def index():
    return app.send_static_file('index.html')

from . import test

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))
