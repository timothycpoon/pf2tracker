from flask import Flask, render_template
from flask_login import LoginManager, current_user
from flask_sqlalchemy import SQLAlchemy
from .config import Config

login_manager = LoginManager()
app = Flask(__name__, static_folder='../build', static_url_path='/')
app.config.from_object(Config)
login_manager.init_app(app)
db = SQLAlchemy(app)

from . import models

@login_manager.user_loader
def load_user(userid):
    return models.UserLogin.query.get(int(userid))

@app.route('/')
def index():
    initialStore = {
        'login': current_user.get_display(),
    }
    return render_template('index.html', initialStore=initialStore)

from . import test
from .user import login

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))
