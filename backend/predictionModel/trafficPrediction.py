from flask import Flask, request, jsonify, render_template
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows cross-origin requests (for frontend)

# Global variables
df = None
model = None
feature_columns = None


def preprocess_and_train_model(file_path):
    global df, model, feature_columns

    try:
        df = pd.read_csv(file_path)
    except FileNotFoundError:
        print(f"Error: File {file_path} not found.")
        return None, None, None

    df["Timestamp"] = pd.to_datetime(df["Timestamp"])
    df["Hour"] = df["Timestamp"].dt.hour
    df["Day_of_Week"] = df["Timestamp"].dt.dayofweek

    # Set Rush Hour Indicator
    df["Rush_Hour_Indicator"] = ((df["Hour"].between(7, 9)) | (df["Hour"].between(17, 19))).astype(int)

    df = pd.get_dummies(df, columns=["Weather_Conditions"], drop_first=True)

    df["High_Congestion"] = ((df["Vehicle_Count"] > df["Vehicle_Count"].median()) &
                             (df["Traffic_Flow_Speed"] < df["Traffic_Flow_Speed"].median())).astype(int)

    df = df.drop(columns=["Timestamp", "Latitude", "Longitude"], errors="ignore")

    X = df.drop(columns=["Location", "Suggested_Route_Adjustment", "High_Congestion"],
                errors='ignore')
    y = df["High_Congestion"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier(n_estimators=200, max_depth=10, min_samples_split=5, random_state=42)
    model.fit(X_train, y_train)

    feature_columns = X_train.columns

    return df, model, feature_columns


# Load dataset and train model
file_path = "traffic_pollution_faisalabad_large_2023.csv"
df, model, feature_columns = preprocess_and_train_model(file_path)


@app.route("/")
def home():
    """Serve the frontend page."""
    return render_template("trafficFrontend.html")  # Ensure this file is in the 'templates' folder


@app.route("/predict", methods=["POST"])
def predict():
    """Handles traffic congestion prediction based on user input."""
    if df is None or model is None:
        return jsonify({"Error": "Model is not loaded properly. Please check the dataset file."})

    data = request.json
    if not data:
        return jsonify({"Error": "Invalid input data"}), 400

    current_location = data.get("current_location")
    destination = data.get("destination")
    hour = int(data.get("hour", -1))  # Ensure hour is an integer

    # Ensure locations exist in dataset
    if current_location not in df["Location"].unique() or destination not in df["Location"].unique():
        return jsonify({"Error": "One or both locations not found in dataset."}), 404

    # Try to filter exact hour, otherwise get closest available hour data
    filtered_data = df[(df["Location"] == current_location) & (df["Hour"] == hour)]

    if filtered_data.empty:
        # Try to find closest available hour in the dataset
        closest_hour = df[(df["Location"] == current_location)]["Hour"].sub(hour).abs().idxmin()
        filtered_data = df.iloc[[closest_hour]]

    # If still empty, return a reasonable estimate using overall location data
    if filtered_data.empty:
        filtered_data = df[df["Location"] == current_location]
        if filtered_data.empty:
            return jsonify({"Error": "No data available for this location."}), 404

    # Estimate congestion probability
    input_data = {
        "Vehicle_Count": filtered_data["Vehicle_Count"].mean(),  # Use mean instead of median
        "NO2_Emissions": filtered_data["NO2_Emissions"].mean(),
        "Traffic_Flow_Speed": filtered_data["Traffic_Flow_Speed"].mean(),
        "Hour": hour,
        "Day_of_Week": filtered_data["Day_of_Week"].mode()[0],
        "Rush_Hour_Indicator": int(7 <= hour <= 9 or 17 <= hour <= 19)  # Ensure Rush Hour is properly considered
    }

    # Adjust congestion probability for rush hours (7-9 AM & 5-7 PM)
    congestion_factor = 1.8 if input_data["Rush_Hour_Indicator"] else 1  # Increased boost from 1.5× to 1.8×

    # Add missing weather condition columns
    for feature in feature_columns:
        if feature not in input_data and feature.startswith("Weather_Conditions_"):
            input_data[feature] = 0

    input_df = pd.DataFrame([input_data])
    input_df = input_df.reindex(columns=feature_columns, fill_value=0)

    congestion_probability = model.predict_proba(input_df)[0][1] * congestion_factor  # Get probability

    # Adjust threshold dynamically instead of fixed 50%
    is_congested = congestion_probability > 0.5

    if is_congested:
        alternative_routes = df[df["Location"] == current_location]["Suggested_Route_Adjustment"].dropna()
        valid_routes = alternative_routes[~alternative_routes.isin(["No change needed", ""])].tolist()

        suggested_route = np.random.choice(valid_routes) if valid_routes else "Take small connecting roads"
        return jsonify({
            "Congestion": "High",
            "Congestion_Probability": round(congestion_probability * 100, 2),
            "Suggested_Alternative_Route": suggested_route
        })
    else:
        return jsonify({
            "Congestion": "Low",
            "Congestion_Probability": round(congestion_probability * 100, 2),
            "Suggested_Route": "Your selected route is fine."
        })


if __name__ == "__main__":
    app.run(debug=True)
