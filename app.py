from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import mysql.connector
import webbrowser
import threading
import os

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Automatically open browser
def open_browser():
    webbrowser.open_new("http://127.0.0.1:5000/")

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

# Database connection
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Malik@123",
        database="atm_system"
    )

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/deposit')
def deposit_page():
    return render_template("deposit.html")

@app.route('/about')
def about_page():
    return render_template("about.html")

@app.route('/authenticate', methods=['POST'])
def authenticate():
    data = request.json
    fingerprint_hash = data.get("fingerprint_hash")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT user_id FROM users WHERE fingerprint_hash = %s", (fingerprint_hash,))
    user = cursor.fetchone()

    if user:
        cursor.execute("SELECT * FROM cards WHERE user_id = %s", (user["user_id"],))
        cards = cursor.fetchall()
        conn.close()
        return jsonify({"success": True, "cards": cards})
    else:
        conn.close()
        return jsonify({"success": False, "message": "Fingerprint not recognized"})

@app.route('/transaction', methods=['POST'])
def transaction():
    data = request.json
    card_id = data.get("card_id")
    action = data.get("action")
    pin = str(data.get("pin")).strip()
    amount = data.get("amount", 0)

    if card_id is None:
        return jsonify({"success": False, "message": "card_id is missing from request"})

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM cards WHERE card_id = %s AND pin = %s", (card_id, pin))
    card = cursor.fetchone()

    if not card:
        conn.close()
        return jsonify({"success": False, "message": "Invalid PIN"})

    if action == "check_balance":
        conn.close()
        return jsonify({"success": True, "balance": card["balance"]})

    elif action == "withdraw":
        if card["balance"] < amount:
            conn.close()
            return jsonify({"success": False, "message": "Insufficient funds"})
        new_balance = card["balance"] - amount
        cursor.execute("UPDATE cards SET balance = %s WHERE card_id = %s", (new_balance, card_id))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Withdrawal successful", "new_balance": new_balance})

    elif action == "deposit":
        new_balance = card["balance"] + amount
        cursor.execute("UPDATE cards SET balance = %s WHERE card_id = %s", (new_balance, card_id))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Deposit successful", "new_balance": new_balance})

@app.route('/terminate', methods=['POST'])
def terminate():
    return jsonify({"success": True, "message": "Transaction terminated successfully."})

if __name__ == '__main__':
    # Remove auto-browser opening and auto-reloader
    app.run(debug=False, use_reloader=False, port=5000)

