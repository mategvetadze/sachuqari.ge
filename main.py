from flask import Flask, request, jsonify, render_template, send_from_directory, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
import os
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required

app = Flask(__name__)
app.secret_key = 'super_secret_key'

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://sachuqari_user:pK4B59OVnQcqIDQS1JwJiW96d38wctQK@dpg-d46th5ripnbc73f6455g-a.frankfurt-postgres.render.com/sachuqari"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

UPLOAD_FOLDER = os.path.join(app.root_path, 'media')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'  

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120))
    age = db.Column(db.Integer)
    phone = db.Column(db.String(30))
    payer_name = db.Column(db.String(120))
    payer_phone = db.Column(db.String(30))
    num_people = db.Column(db.Integer)
    video_type = db.Column(db.String(50))
    delivery_method = db.Column(db.String(50))
    about = db.Column(db.Text)
    gmail = db.Column(db.String(120))
    image_paths = db.Column(db.Text)

class User(UserMixin):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

users = {
    'admin': User(id=1, username='admin', password='1234')
}

@login_manager.user_loader
def load_user(user_id):
    for user in users.values():
        if str(user.id) == str(user_id):
            return user
    return None

@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        try:
            full_name = request.form.get('fullName')
            age = request.form.get('age')
            phone = request.form.get('phoneNumber')
            payer_name = request.form.get('payerName')
            payer_phone = request.form.get('payerPhone')
            num_people = request.form.get('numPeople')
            video_type = request.form.get('videoType')
            delivery_method = request.form.get('deliveryMethod')
            about = request.form.get('about')
            gmail = request.form.get('gmailAddress')

            saved_paths = []

            for file_key, file in request.files.items():
                if file and file.filename:
                    filename = secure_filename(file.filename)
                    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

                    base, ext = os.path.splitext(filename)
                    counter = 1
                    while os.path.exists(file_path):
                        filename = f"{base}_{counter}{ext}"
                        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                        counter += 1

                    file.save(file_path)
                    saved_paths.append(f"/media/{filename}")

            new_order = Order(
                full_name=full_name,
                age=age,
                phone=phone,
                payer_name=payer_name,
                payer_phone=payer_phone,
                num_people=num_people,
                video_type=video_type,
                delivery_method=delivery_method,
                about=about,
                gmail=gmail,
                image_paths=",".join(saved_paths)
            )

            db.session.add(new_order)
            db.session.commit()

            return jsonify({
                "status": "success",
                "message": f"Order saved with {len(saved_paths)} images.",
                "image_paths": saved_paths
            }), 201

        except Exception as e:
            print("Error while saving order:", e)
            return jsonify({"status": "error", "message": str(e)}), 500

    return render_template('home.html')

@app.route('/media/<path:filename>')
def serve_media(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/admin')
@login_required
def admin():
    orders = Order.query.all()
    return render_template('admin.html', orders=orders)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = users.get(username)
        if user and user.password == password:
            login_user(user)
            return redirect(url_for('admin'))
        return "Invalid username or password", 401
    return render_template('adminlogin.html')

@app.route('/delete-order/<int:order_id>', methods=['POST'])
@login_required
def delete_order(order_id):
    order = Order.query.get_or_404(order_id)  # fetch order or return 404
    db.session.delete(order)
    db.session.commit()
    return redirect(url_for('admin'))

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)
