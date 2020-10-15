from flask_login import UserMixin
from sqlalchemy import Column, Integer, String, Date
from server.app import db
from werkzeug.security import generate_password_hash, check_password_hash

class UserLogin(UserMixin, db.Model):
    __tablename__ = 'user_login'
    id = db.Column('id', db.Integer, primary_key=True)
    username = db.Column('username', db.String(50), index=True, unique=True)
    email = db.Column('email', db.String(128), index=True, unique=True)
    password = db.Column('password', db.String(128))

    def save():
        db.session.add(this)
        db.session.commit()

    def __repr__(self):
        return f"<UserLogin {self.id} username='{self.username}' email='{self.email}'>"

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def get_display(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
        }
