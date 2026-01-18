from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import json
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'HelloMrAJ'

# Flask-Login setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

users_db = {}
starred_results_db = {}

class User(UserMixin):
    def __init__(self, user_id, username, password_hash):
        self.id = user_id
        self.username = username
        self.password_hash = password_hash

@login_manager.user_loader
def load_user(user_id):
    if user_id in users_db:
        return users_db[user_id]
    return None

@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('simulator'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('simulator'))
    
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        action = data.get('action')
        
        if action == 'register':
            # Register new user
            if any(u.username == username for u in users_db.values()):
                return jsonify({'success': False, 'message': 'Username already exists'})
            
            user_id = str(len(users_db) + 1)
            password_hash = generate_password_hash(password)
            user = User(user_id, username, password_hash)
            users_db[user_id] = user
            starred_results_db[user_id] = []
            
            login_user(user)
            return jsonify({'success': True, 'redirect': url_for('simulator')})
        
        elif action == 'login':
            # Login existing user
            user = next((u for u in users_db.values() if u.username == username), None)
            if user and check_password_hash(user.password_hash, password):
                login_user(user)
                return jsonify({'success': True, 'redirect': url_for('simulator')})
            return jsonify({'success': False, 'message': 'Invalid username or password'})
    
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/simulator')
@login_required
def simulator():
    return render_template('simulator.html', username=current_user.username)

@app.route('/account')
@login_required
def account():
    user_starred = starred_results_db.get(current_user.id, [])
    return render_template('account.html', username=current_user.username, starred_results=user_starred)

@app.route('/api/star-result', methods=['POST'])
@login_required
def star_result():
    data = request.get_json()
    result_data = {
        'id': f"{current_user.id}_{len(starred_results_db.get(current_user.id, []))}_{datetime.now().timestamp()}",
        'modality': data.get('modality'),
        'parameters': data.get('parameters'),
        'metrics': data.get('metrics'),
        'timestamp': datetime.now().isoformat(),
        'name': data.get('name', f"Configuration {len(starred_results_db.get(current_user.id, [])) + 1}")
    }
    
    if current_user.id not in starred_results_db:
        starred_results_db[current_user.id] = []
    
    starred_results_db[current_user.id].append(result_data)
    return jsonify({'success': True, 'result': result_data})

@app.route('/api/unstar-result', methods=['POST'])
@login_required
def unstar_result():
    data = request.get_json()
    result_id = data.get('id')
    
    if current_user.id in starred_results_db:
        starred_results_db[current_user.id] = [
            r for r in starred_results_db[current_user.id] if r['id'] != result_id
        ]
    
    return jsonify({'success': True})

@app.route('/api/get-starred-results')
@login_required
def get_starred_results():
    results = starred_results_db.get(current_user.id, [])
    return jsonify({'success': True, 'results': results})

@app.route('/api/update-result-name', methods=['POST'])
@login_required
def update_result_name():
    data = request.get_json()
    result_id = data.get('id')
    new_name = data.get('name')
    
    if current_user.id in starred_results_db:
        for result in starred_results_db[current_user.id]:
            if result['id'] == result_id:
                result['name'] = new_name
                return jsonify({'success': True})
    
    return jsonify({'success': False, 'message': 'Result not found'})

if __name__ == '__main__':
    app.run(debug=True)