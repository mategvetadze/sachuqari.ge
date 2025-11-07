from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

# Database setup
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://sachuqari_user:pK4B59OVnQcqIDQS1JwJiW96d38wctQK@dpg-d46th5ripnbc73f6455g-a.frankfurt-postgres.render.com/sachuqari"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Folder to store uploaded images
UPLOAD_FOLDER = os.path.join(app.root_path, 'media')  # Like Django's MEDIA_ROOT
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

db = SQLAlchemy(app)

# -----------------------------------------------------------------------------
# MODELS
# -----------------------------------------------------------------------------
class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120))
    phone = db.Column(db.String(30))
    video_type = db.Column(db.String(50))
    num_people = db.Column(db.Integer)
    delivery_method = db.Column(db.String(50))
    gmail = db.Column(db.String(120))
    people_data = db.Column(db.Text)
    image_paths = db.Column(db.Text)  # Comma-separated list of image URLs


# -----------------------------------------------------------------------------
# ROUTES
# -----------------------------------------------------------------------------
@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        full_name = request.form.get('fullName')
        phone = request.form.get('phoneNumber')
        video_type = request.form.get('videoType')
        num_people = request.form.get('numPeople')
        delivery_method = request.form.get('deliveryMethod')
        gmail = request.form.get('gmailAddress')
        people_data = request.form.get('peopleData')

        saved_paths = []

        # Save uploaded files to /media/
        for file_key, file in request.files.items():
            if file and file.filename:
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

                # Avoid overwriting files with same name
                base, ext = os.path.splitext(filename)
                counter = 1
                while os.path.exists(file_path):
                    filename = f"{base}_{counter}{ext}"
                    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    counter += 1

                file.save(file_path)

                # Save relative URL for web access
                saved_paths.append(f"/media/{filename}")

        new_order = Order(
            full_name=full_name,
            phone=phone,
            video_type=video_type,
            num_people=num_people,
            delivery_method=delivery_method,
            gmail=gmail,
            people_data=people_data,
            image_paths=",".join(saved_paths)
        )

        db.session.add(new_order)
        db.session.commit()

        return jsonify({
            'status': 'success',
            'message': f'Order saved with {len(saved_paths)} images.',
            'image_paths': saved_paths
        }), 201

    return render_template('home.html')


@app.route('/media/<path:filename>')
def serve_media(filename):
    """Serve uploaded media files (like Django’s MEDIA_URL)."""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/admin', methods=['GET'])
def admin():
    orders = Order.query.all()
    return render_template('admin.html', orders=orders)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)