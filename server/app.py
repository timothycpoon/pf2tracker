from flask import Flask, render_template
from flask_login import LoginManager, current_user
from flask_sqlalchemy import SQLAlchemy
from .config import Config
import json

login_manager = LoginManager()
app = Flask(__name__, static_folder='react', static_url_path='')
app.config.from_object(Config)
login_manager.init_app(app)
db = SQLAlchemy(app)

from .user import user_login

@login_manager.user_loader
def load_user(userid):
    return user_login.get_by_id(int(userid))

from .creature import creature

@app.route('/')
def index():
    creatures = [creature.Creature.query.get(1).to_combat()]
    for idx, c in enumerate(creatures):
        c['id'] = idx
    initialStore = {
        'login': current_user.get_display() if current_user and current_user.is_authenticated else None,
        'creatures': creatures,
    }
    return render_template('index.html', initialStore=json.dumps(initialStore))

from . import test
from .user import login

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))
