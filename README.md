☕ Epic Coffee Journey App
A hilariously dramatic coffee rating web application built with Flask that lets you document your caffeine adventures with photos, over-the-top reviews, and artistic expressions!

🎭 Features
📸 Before & After Photos
Take photos with your device camera or upload from gallery
Skip photo option for when you're too caffeinated to focus
Precise timestamps down to the second
Mobile-friendly camera integration
✍️ Live Review Writing
Write your review while drinking your coffee
Real-time timer tracking your review duration
Get random dramatic adjectives and silly descriptions
Over-the-top coffee descriptions like "This coffee is like a warm hug from a caffeinated angel"
🎨 Drawing Canvas
Express how the coffee made you feel through art
Multiple brush sizes and colors
Preset shapes: smiley faces, hearts, stars, and coffee beans
Touch-friendly for mobile devices
📊 Dramatic Rating System
Energy Level (1-10): From "Still sleepy" to "SUPER CHARGED!"
Taste Rating (1-10): From "Needs work" to "HEAVENLY!"
Drama Level (1-10): From "Chill vibes" to "EPIC DRAMA!"
🎪 Gallery & Journey Details
View all coffee adventures in a beautiful gallery
Before/after photo carousels
Complete journey timelines with precise timestamps
Automatically generated silly adjectives for each journey
Journey duration calculations
🚀 Tech Stack
Backend: Flask with SQLAlchemy
Frontend: Bootstrap 5, vanilla JavaScript
Database: SQLite (easily switchable to PostgreSQL)
Styling: Custom CSS with animations and gradients
Icons: Font Awesome
Fonts: Google Fonts (Fredoka One, Comic Neue)
🛠️ Installation & Setup
Prerequisites
Python 3.11+
pip package manager
Local Development
# Clone the repository
git clone [your-repo-url]
cd coffee-journey-app
# Install dependencies
pip install flask flask-sqlalchemy gunicorn psycopg2-binary
# Run the application
python main.py
The app will be available at http://localhost:5000

Deploy on Replit
Import this repository to Replit
The app will automatically install dependencies
Click "Run" to start the server
Use the "Deploy" tab to make it publicly accessible
📱 Mobile Support
The app is fully responsive and mobile-friendly:

Touch-friendly drawing canvas
Camera access with fallback to file upload
Optimized layouts for phone screens
Skip photo options for devices without camera support
🎨 Project Structure
coffee-journey-app/
├── static/
│   ├── css/
│   │   └── style.css          # Custom styles and animations
│   └── js/
│       ├── app.js             # Global functionality
│       ├── camera.js          # Camera and photo handling
│       └── drawing.js         # Canvas drawing functionality
├── templates/
│   ├── base.html              # Base template with navigation
│   ├── index.html             # Homepage with gallery preview
│   ├── new_journey.html       # Multi-step journey creation
│   ├── journey_detail.html    # Individual journey view
│   └── gallery.html           # All journeys gallery
├── app.py                     # Flask app configuration
├── models.py                  # Database models
├── routes.py                  # Application routes
└── main.py                    # Application entry point
🎯 Usage
Start a New Journey: Click "Start Your Journey!" on the homepage
Basic Info: Enter coffee shop name and drink name
Before Photo: Take a photo, upload one, or skip
Live Review: Write your review while drinking, use inspiration buttons for dramatic flair
Rate Your Experience: Use sliders for Energy, Taste, and Drama levels
Draw Your Feelings: Express how the coffee made you feel through art
After Photo: Capture your post-coffee transformation
Complete: View your epic journey and share with friends!
🎭 Sample Features in Action
Dramatic Adjectives: "Transcendent", "Mind-blowing", "Euphoric", "Spectacular"
Silly Descriptions: "This brew has awakened my soul and possibly my third eye"
Precise Timing: Everything timestamped to the second for maximum drama
Journey Duration: See exactly how long your coffee experience lasted
🌟 Perfect For
Coffee shops wanting to engage customers
Friend groups documenting coffee adventures
Anyone who loves dramatic, over-the-top experiences
Social media content creation
Coffee enthusiasts with a sense of humor
🔧 Customization
The app is designed to be easily customizable:

Add new silly adjectives in routes.py
Modify rating scales in models.py
Update styling in static/css/style.css
Add new drawing tools in static/js/drawing.js
📄 License
This project is open source and available under the MIT License.

🤝 Contributing
Contributions are welcome! Feel free to:

Add more silly coffee descriptions
Improve mobile compatibility
Add new drawing tools
Enhance the rating system
Fix bugs or improve performance
Made with dramatic coffee love ☕️❤️

Turn your coffee breaks into epic adventures!
