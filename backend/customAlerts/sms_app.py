# import os
# import requests
# import threading
# import time
# from flask import Flask, request, jsonify
# from twilio.rest import Client
# from flask_cors import CORS
# from dotenv import load_dotenv
# from datetime import datetime
#
# load_dotenv()  # Load environment variables
#
# app = Flask(__name__)
# CORS(app)  # Enable CORS
#
# # Twilio credentials
# TWILIO_SID = os.getenv("TWILIO_SID")
# TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
# TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
#
# client = Client(TWILIO_SID, TWILIO_AUTH_TOKEN)
#
# # Traffic Prediction API URL
# TRAFFIC_API_URL = "http://127.0.0.1:5000/predict"  # Update this if hosted elsewhere
#
# # Function to send SMS
# def send_sms(phone_number, message):
#     try:
#         msg = client.messages.create(
#             body=message,
#             from_=TWILIO_PHONE_NUMBER,
#             to=phone_number
#         )
#         print(f"✅ SMS sent to {phone_number}, SID: {msg.sid}")
#     except Exception as e:
#         print(f"❌ Error sending SMS: {e}")
#
# # Background function to delay sending SMS
# def schedule_sms(phone_number, message, send_time):
#     delay = (send_time - datetime.now()).total_seconds()
#     if delay > 0:
#         print(f"⌛ SMS scheduled in {delay} seconds...")
#         time.sleep(delay)
#         send_sms(phone_number, message)
#     else:
#         print("❌ Scheduled time is in the past. Sending immediately.")
#         send_sms(phone_number, message)
#
# @app.route("/schedule-alert", methods=["POST"])
# def schedule_alert():
#     data = request.json
#     phone_number = data.get("phoneNumber")
#     current_location = data.get("current_location")
#     destination = data.get("destination")
#     departure_time_str = data.get("departure_time")  # When user plans to leave
#     alert_time_str = data.get("alert_time")  # When SMS should be sent
#
#     if not all([phone_number, current_location, destination, departure_time_str, alert_time_str]):
#         return jsonify({"success": False, "error": "Missing required fields"}), 400
#
#     try:
#         departure_time = datetime.strptime(departure_time_str, "%Y-%m-%dT%H:%M")
#         alert_time = datetime.strptime(alert_time_str, "%Y-%m-%dT%H:%M")
#     except ValueError:
#         return jsonify({"success": False, "error": "Invalid datetime format. Use YYYY-MM-DDTHH:MM."}), 400
#
#     # Call the Traffic Prediction API
#     traffic_response = requests.post(TRAFFIC_API_URL, json={
#         "current_location": current_location,
#         "destination": destination,
#         "datetime": departure_time_str
#     })
#
#     if traffic_response.status_code != 200:
#         return jsonify({"success": False, "error": "Failed to get traffic prediction"}), 500
#
#     traffic_data = traffic_response.json()
#
#     if "Error" in traffic_data:
#         return jsonify({"success": False, "error": traffic_data["Error"]}), 400
#
#     congestion = traffic_data["Congestion"]
#     congestion_probability = traffic_data["Congestion_Probability"]
#     suggested_route = traffic_data.get("Suggested_Alternative_Route", "Your selected route is fine.")
#
#     sms_message = (
#         f"🚦 Traffic Alert 🚦\n"
#         f"From: {current_location}\n"
#         f"To: {destination}\n"
#         f"Departure Time: {departure_time.strftime('%I:%M %p')}\n"
#         f"Congestion Level: {congestion} ({congestion_probability}%)\n"
#         f"Route Advice: {suggested_route}"
#     )
#
#     # Schedule the SMS alert
#     threading.Thread(target=schedule_sms, args=(phone_number, sms_message, alert_time)).start()
#
#     return jsonify({"success": True, "message": "SMS alert scheduled!"})
#
# if __name__ == "__main__":
#     app.run(debug=True, port=5001)  # Run on different port (5001) to avoid conflict


import os
import requests
import threading
import time
from flask import Flask, request, jsonify, render_template  # Added render_template
from twilio.rest import Client
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()  # Load environment variables

app = Flask(__name__, template_folder="templates")  # Specify template folder
CORS(app)  # Enable CORS

# Twilio credentials
TWILIO_SID = os.getenv("TWILIO_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

client = Client(TWILIO_SID, TWILIO_AUTH_TOKEN)

# Traffic Prediction API URL
TRAFFIC_API_URL = "http://127.0.0.1:5005/predict"  # Update if hosted elsewhere

# Home route to render `sms_frontend.html`
@app.route("/")
def home():
    return render_template("sms_frontend.html")

# Function to send SMS
def send_sms(phone_number, message):
    try:
        msg = client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=phone_number
        )
        print(f"✅ SMS sent to {phone_number}, SID: {msg.sid}")
    except Exception as e:
        print(f"❌ Error sending SMS: {e}")

# Background function to delay sending SMS
def schedule_sms(phone_number, message, send_time):
    delay = (send_time - datetime.now()).total_seconds()
    if delay > 0:
        print(f"⌛ SMS scheduled in {delay} seconds...")
        time.sleep(delay)
        send_sms(phone_number, message)
    else:
        print("❌ Scheduled time is in the past. Sending immediately.")
        send_sms(phone_number, message)

@app.route("/schedule-alert", methods=["POST"])
def schedule_alert():
    data = request.json
    phone_number = data.get("phoneNumber")
    current_location = data.get("current_location")
    destination = data.get("destination")
    departure_time_str = data.get("departure_time")
    alert_time_str = data.get("alert_time")

    if not all([phone_number, current_location, destination, departure_time_str, alert_time_str]):
        return jsonify({"success": False, "error": "Missing required fields"}), 400

    try:
        departure_time = datetime.strptime(departure_time_str, "%Y-%m-%dT%H:%M")
        alert_time = datetime.strptime(alert_time_str, "%Y-%m-%dT%H:%M")
    except ValueError:
        return jsonify({"success": False, "error": "Invalid datetime format. Use YYYY-MM-DDTHH:MM."}), 400

    # Call the Traffic Prediction API
    traffic_response = requests.post(TRAFFIC_API_URL, json={
        "current_location": current_location,
        "destination": destination,
        "datetime": departure_time_str
    })

    if traffic_response.status_code != 200:
        return jsonify({"success": False, "error": "Failed to get traffic prediction"}), 500

    traffic_data = traffic_response.json()

    if "Error" in traffic_data:
        return jsonify({"success": False, "error": traffic_data["Error"]}), 400

    suggested_route = traffic_data.get("Suggested_Alternative_Route", "Your selected route is fine.")

    # Updated SMS message (removed congestion level)
    sms_message = (
        f"🚦 Traffic Alert 🚦\n"
        f"From: {current_location}\n"
        f"To: {destination}\n"
        f"Departure Time: {departure_time.strftime('%I:%M %p')}\n"
        f"Route Advice: {suggested_route}"
    )

    # Schedule the SMS alert
    threading.Thread(target=schedule_sms, args=(phone_number, sms_message, alert_time)).start()

    return jsonify({"success": True, "message": "SMS alert scheduled!"})


if __name__ == "__main__":
    app.run(debug=True, port=5006)  # Run on port 5001
