# Dependencies
from flask import Flask, request, jsonify, render_template
import xgboost as xgb
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow CORS for all routes by default
CORS(app, resources={r"/predict": {"origins": "http://127.0.0.1:5000"}}) # Setting explicit path

# Allow CORS for React (localhost:3000) in your development environment
CORS(app, resources={r"/predict": {"origins": "http://localhost:3000"}})

# Load the pre-trained model
model = xgb.Booster()
model.load_model("xgboost_model.json")

# Function to preprocess input data into DMatrix format
def preprocess_input(longitude, latitude):
    data = pd.DataFrame({'longitude': [longitude], 'latitude': [latitude]})
    return xgb.DMatrix(data)

@app.route('/')
def index():
    return render_template('predictionModel.html')

@app.route('/predict', methods=['GET'])
def predict():
    # Extract query parameters
    longitude = float(request.args.get('longitude'))
    latitude = float(request.args.get('latitude'))

    # Create a DMatrix for prediction
    dmatrix = preprocess_input(longitude, latitude)

    # Make prediction
    prediction = model.predict(dmatrix)

    # Return the predicted AQI
    return jsonify({"predicted_aqi": float(prediction[0])})

if __name__ == '__main__':
    app.run(port=5004, debug=True)


