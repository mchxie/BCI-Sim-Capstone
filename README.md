# BCI-Sim-Capstone

## Project Structure
├── app.py
├── requirements.txt
├── static/
│ ├── css/
│ │ └── custom.css
│ └── js/
│ └── app.js
└── templates/
├── base.html
├── login.html
├── simulator.html
└── account.html

## How to run the project
### Clone the repo
git clone <your-repo-url>
cd bci-simulator

### Create a venv
python -m venv venv
source venv/bin/activate   # macOS / Linux
venv\Scripts\activate      # Windows

### Install dependencies
pip install -r requirements.txt

### Run it!
python app.py

### Open it in your browser
http://127.0.0.1:5000

## Other notes
- User data is stored in memory and is lost when the server restarts.
- Secret key is hardcoded in because it's a school project. I promise I would not do this in real production
