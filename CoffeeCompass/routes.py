from flask import render_template, request, redirect, url_for, jsonify, flash
from app import app, db
from models import CoffeeJourney
from datetime import datetime
import json
import random

# Silly coffee adjectives for the generator
SILLY_ADJECTIVES = [
    "Transcendent", "Mind-blowing", "Life-changing", "Euphoric", "Spectacular",
    "Magical", "Heavenly", "Divine", "Extraordinary", "Phenomenal",
    "Stupendous", "Marvelous", "Incredible", "Fantastic", "Amazing",
    "Breathtaking", "Stunning", "Magnificent", "Glorious", "Wondrous",
    "Miraculous", "Splendid", "Superb", "Outstanding", "Remarkable",
    "Astonishing", "Dazzling", "Brilliant", "Fabulous", "Sensational"
]

COFFEE_DESCRIPTIONS = [
    "This coffee is like a warm hug from a caffeinated angel",
    "Each sip transports me to a realm of pure caffeinated bliss",
    "This brew has awakened my soul and possibly my third eye",
    "I can feel my chakras aligning with every drop",
    "This coffee doesn't just wake me up, it resurrects me",
    "My taste buds are having a full-blown celebration",
    "This is what liquid motivation tastes like",
    "I've achieved coffee enlightenment in a single cup"
]

@app.route('/')
def index():
    recent_journeys = CoffeeJourney.query.order_by(CoffeeJourney.created_at.desc()).limit(6).all()
    return render_template('index.html', recent_journeys=recent_journeys)

@app.route('/new-journey')
def new_journey():
    return render_template('new_journey.html')

@app.route('/save-journey', methods=['POST'])
def save_journey():
    try:
        journey = CoffeeJourney()
        journey.coffee_shop = request.form.get('coffee_shop', '')
        journey.drink_name = request.form.get('drink_name', '')
        journey.before_photo = request.form.get('before_photo', '')
        journey.after_photo = request.form.get('after_photo', '')
        journey.drawing = request.form.get('drawing', '')
        journey.live_review = request.form.get('live_review', '')
        journey.energy_level = int(request.form.get('energy_level', 5))
        journey.taste_rating = int(request.form.get('taste_rating', 5))
        journey.drama_level = int(request.form.get('drama_level', 5))
        
        # Parse timestamps
        before_time_str = request.form.get('before_photo_time')
        after_time_str = request.form.get('after_photo_time')
        review_start_str = request.form.get('review_start_time')
        review_end_str = request.form.get('review_end_time')
        
        if before_time_str:
            journey.before_photo_time = datetime.fromisoformat(before_time_str.replace('Z', '+00:00'))
        if after_time_str:
            journey.after_photo_time = datetime.fromisoformat(after_time_str.replace('Z', '+00:00'))
        if review_start_str:
            journey.review_start_time = datetime.fromisoformat(review_start_str.replace('Z', '+00:00'))
        if review_end_str:
            journey.review_end_time = datetime.fromisoformat(review_end_str.replace('Z', '+00:00'))
        
        # Generate silly adjectives
        adjectives = random.sample(SILLY_ADJECTIVES, 3)
        journey.set_silly_adjectives(adjectives)
        
        db.session.add(journey)
        db.session.commit()
        
        flash('Your epic coffee journey has been saved!', 'success')
        return redirect(url_for('journey_detail', id=journey.id))
    except Exception as e:
        app.logger.error(f"Error saving journey: {e}")
        flash('Oops! Something went wrong saving your journey.', 'error')
        return redirect(url_for('new_journey'))

@app.route('/journey/<int:id>')
def journey_detail(id):
    journey = CoffeeJourney.query.get_or_404(id)
    return render_template('journey_detail.html', journey=journey)

@app.route('/gallery')
def gallery():
    journeys = CoffeeJourney.query.order_by(CoffeeJourney.created_at.desc()).all()
    return render_template('gallery.html', journeys=journeys)

@app.route('/api/random-adjective')
def random_adjective():
    return jsonify({'adjective': random.choice(SILLY_ADJECTIVES)})

@app.route('/api/random-description')
def random_description():
    return jsonify({'description': random.choice(COFFEE_DESCRIPTIONS)})

@app.route('/delete-journey/<int:id>', methods=['POST'])
def delete_journey(id):
    journey = CoffeeJourney.query.get_or_404(id)
    db.session.delete(journey)
    db.session.commit()
    flash('Journey deleted successfully!', 'success')
    return redirect(url_for('gallery'))
