from server.app import db

class Creature(db.Model):
    __tablename__ = 'creature'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    max_hp = db.Column(db.Integer)
    ac = db.Column(db.Integer)
    fortitude = db.Column(db.Integer)
    reflex = db.Column(db.Integer)
    will = db.Column(db.Integer)
    perception = db.Column(db.Integer)
    stealth = db.Column(db.Integer)
    user_id = db.Column(db.ForeignKey('user_login.id'))

    def __repr__(self):
        return f"<Creature {self.id} name='{self.name}'>"

    def to_combat(self):
        return {
            "creature_id": self.id,
            "name": self.name,
            "hp": {
                "maxHP": self.max_hp,
                "currHP": self.max_hp,
            },
            "ac": self.ac,
            "fortitude": self.fortitude,
            "reflex": self.reflex,
            "will": self.will,
            "initiative": {
                "initSkill": "perception",
                "perception": self.perception,
                "stealth": self.stealth,
            },
        }

