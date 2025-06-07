from app import db
from datetime import datetime
import json

class CoffeeJourney(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    coffee_shop = db.Column(db.String(200), nullable=False)
    drink_name = db.Column(db.String(200), nullable=False)
    before_photo = db.Column(db.Text)  # Base64 encoded photo
    after_photo = db.Column(db.Text)   # Base64 encoded photo
    drawing = db.Column(db.Text)       # Base64 encoded canvas data
    live_review = db.Column(db.Text)
    energy_level = db.Column(db.Integer, default=5)  # 1-10 scale
    taste_rating = db.Column(db.Integer, default=5)  # 1-10 scale
    drama_level = db.Column(db.Integer, default=5)   # 1-10 scale
    silly_adjectives = db.Column(db.Text)  # JSON array of adjectives
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    before_photo_time = db.Column(db.DateTime)
    after_photo_time = db.Column(db.DateTime)
    review_start_time = db.Column(db.DateTime)
    review_end_time = db.Column(db.DateTime)
    
    def get_silly_adjectives(self):
        if self.silly_adjectives:
            return json.loads(self.silly_adjectives)
        return []
    
    def set_silly_adjectives(self, adjectives):
        self.silly_adjectives = json.dumps(adjectives)
    
    def get_time_difference(self):
        if self.before_photo_time and self.after_photo_time:
            diff = self.after_photo_time - self.before_photo_time
            minutes = int(diff.total_seconds() / 60)
            seconds = int(diff.total_seconds() % 60)
            return f"{minutes}m {seconds}s"
        return "Unknown"
