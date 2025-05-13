# # from flask import Flask, request, jsonify, render_template
# # import pandas as pd
# # import numpy as np
# # import joblib
# # from flask_cors import CORS
# # import os

# # app = Flask(__name__)
# # CORS(app)

# # BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# # MODEL_PATH = os.path.join(BASE_DIR, "traffic_random_forest.pkl")
# # DATASET_PATH = os.path.join(BASE_DIR, "traffic_processed_data.csv")  # Load preprocessed dataset

# # # Load model & dataset
# # try:
# #     model_data = joblib.load(MODEL_PATH)
# #     model = model_data["model"]
# #     feature_columns = model_data["features"]
# #     df = pd.read_csv(DATASET_PATH)
# #     print("Model and dataset loaded successfully.")
# # except FileNotFoundError:
# #     print("Error: Model or dataset file not found. Train the model first!")
# #     model, df, feature_columns = None, None, None

# # @app.route("/")
# # def home():
# #     """Serve the frontend page."""
# #     return render_template("trafficFrontend.html")

# # @app.route("/predict", methods=["POST"])
# # def predict():
# #     """Handles traffic congestion prediction based on user input."""
# #     if model is None or df is None:
# #         return jsonify({"Error": "Model is not loaded. Please train it first."}), 500

# #     data = request.json
# #     if not data:
# #         return jsonify({"Error": "Invalid input data"}), 400

# #     current_location = data.get("current_location")
# #     destination = data.get("destination")
# #     hour = int(data.get("hour", -1))

# #     if current_location not in df["Location"].unique() or destination not in df["Location"].unique():
# #         return jsonify({"Error": "One or both locations not found in dataset."}), 404

# #     filtered_data = df[(df["Location"] == current_location) & (df["Hour"] == hour)]
# #     if filtered_data.empty:
# #         filtered_data = df[df["Location"] == current_location]

# #     input_data = {
# #         "Vehicle_Count": filtered_data["Vehicle_Count"].mean(),
# #         "NO2_Emissions": filtered_data["NO2_Emissions"].mean(),
# #         "Traffic_Flow_Speed": filtered_data["Traffic_Flow_Speed"].mean(),
# #         "Hour": hour,
# #         "Day_of_Week": filtered_data["Day_of_Week"].mode()[0],
# #         "Rush_Hour_Indicator": int(7 <= hour <= 9 or 17 <= hour <= 19)
# #     }

# #     congestion_factor = 1.8 if input_data["Rush_Hour_Indicator"] else 1

# #     for feature in feature_columns:
# #         if feature not in input_data and feature.startswith("Weather_Conditions_"):
# #             input_data[feature] = 0

# #     input_df = pd.DataFrame([input_data])
# #     input_df = input_df.reindex(columns=feature_columns, fill_value=0)

# #     congestion_probability = model.predict_proba(input_df)[0][1] * congestion_factor
# #     is_congested = congestion_probability > 0.5

# #     if is_congested:
# #         alternative_routes = df[df["Location"] == current_location]["Suggested_Route_Adjustment"].dropna()
# #         valid_routes = alternative_routes[~alternative_routes.isin(["No change needed", ""])].tolist()
# #         suggested_route = np.random.choice(valid_routes) if valid_routes else "Take small connecting roads"
# #         return jsonify({
# #             "Congestion": "High",
# #             "Congestion_Probability": round(congestion_probability * 100, 2),
# #             "Suggested_Alternative_Route": suggested_route
# #         })
# #     else:
# #         return jsonify({
# #             "Congestion": "Low",
# #             "Congestion_Probability": round(congestion_probability * 100, 2),
# #             "Suggested_Route": "Your selected route is fine."
# #         })

# # if __name__ == "__main__":
# #     app.run(debug=True)

# from flask import Flask, request, jsonify, render_template
# import pandas as pd
# import numpy as np
# import joblib
# from flask_cors import CORS
# import os
# from datetime import datetime

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# MODEL_PATH = os.path.join(BASE_DIR, "traffic_random_forest_new.pkl")  # Updated file name
# DATASET_PATH = os.path.join(BASE_DIR, "traffic_processed_data_new.csv")  # Updated file name

# # Load model & dataset
# try:
#     model_data = joblib.load(MODEL_PATH)
#     model = model_data["model"]
#     feature_columns = model_data["features"]
#     df = pd.read_csv(DATASET_PATH)

#     if "Timestamp" in df.columns:
#         df["Timestamp"] = pd.to_datetime(df["Timestamp"], errors="coerce")

#     print("✅ Model and dataset loaded successfully.")
# except FileNotFoundError:
#     print("❌ Error: Model or dataset file not found. Train the model first!")
#     model, df, feature_columns = None, None, None


# @app.route("/")
# def home():
#     """Serve the frontend page."""
#     return render_template("trafficFrontend_new.html")


# @app.route("/predict", methods=["POST"])
# def predict():
#     """Handles traffic congestion prediction based on user input."""
#     if model is None or df is None:
#         return jsonify({"Error": "Model is not loaded. Please train it first."}), 500

#     data = request.json
#     if not data:
#         return jsonify({"Error": "Invalid input data"}), 400

#     current_location = data.get("current_location")
#     destination = data.get("destination")
#     datetime_str = data.get("datetime")

#     try:
#         input_datetime = datetime.strptime(datetime_str, "%Y-%m-%dT%H:%M")
#     except ValueError:
#         return jsonify({"Error": "Invalid datetime format. Use YYYY-MM-DDTHH:MM."}), 400

#     if current_location not in df["Location"].unique() or destination not in df["Location"].unique():
#         return jsonify({"Error": "One or both locations not found in dataset."}), 404

#     hour = input_datetime.hour
#     day_of_week = input_datetime.weekday()

#     filtered_data = df[(df["Location"] == current_location) & (df["Hour"] == hour) & (df["Day_of_Week"] == day_of_week)]
#     if filtered_data.empty:
#         filtered_data = df[(df["Location"] == current_location) & (df["Day_of_Week"] == day_of_week)]
#     if filtered_data.empty:
#         filtered_data = df[df["Location"] == current_location]

#     input_data = {
#         "Vehicle_Count": filtered_data["Vehicle_Count"].mean(),
#         "NO2_Emissions": filtered_data["NO2_Emissions"].mean(),
#         "Traffic_Flow_Speed": filtered_data["Traffic_Flow_Speed"].mean(),
#         "Hour": hour,
#         "Day_of_Week": day_of_week,
#         "Rush_Hour_Indicator": int(7 <= hour <= 9 or 17 <= hour <= 19)
#     }

#     for feature in feature_columns:
#         if feature not in input_data and feature.startswith("Weather_Conditions_"):
#             input_data[feature] = 0

#     input_df = pd.DataFrame([input_data])
#     input_df = input_df.reindex(columns=feature_columns, fill_value=0)

#     congestion_probability = model.predict_proba(input_df)[0][1]
#     is_congested = congestion_probability > 0.5

#     if is_congested:
#         alternative_routes = df[df["Location"] == current_location]["Suggested_Route_Adjustment"].dropna()
#         valid_routes = alternative_routes[~alternative_routes.isin(["No change needed", ""])].tolist()
#         suggested_route = np.random.choice(valid_routes) if valid_routes else "Take small connecting roads"
#         return jsonify({
#             "Congestion": "High",
#             "Congestion_Probability": round(congestion_probability * 100, 2),
#             "Suggested_Alternative_Route": suggested_route
#         })
#     else:
#         return jsonify({
#             "Congestion": "Low",
#             "Congestion_Probability": round(congestion_probability * 100, 2),
#             "Suggested_Route": "Your selected route is fine."
#         })


# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5005, debug=True)  # Bind to all hosts




from flask import Flask, request, jsonify, render_template
import pandas as pd
import numpy as np
import joblib
from tensorflow.keras.models import load_model
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins
# CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins
# CORS(app, resources={r"/predict": {"origins": "http://127.0.0.1:3000"}})

# --- Load RNN model and scalers ---
model = load_model("rnn_high_congestion_model.h5")
scaler_X = joblib.load("rnn_feature_scaler.pkl")
feature_columns = joblib.load("rnn_feature_columns.pkl")

# --- Load dataset for location & route info ---
df = pd.read_csv("traffic_pollution_faisalabad_large_2023.csv")
df["Timestamp"] = pd.to_datetime(df["Timestamp"])
df["Hour"] = df["Timestamp"].dt.hour
df["Day_of_Week"] = df["Timestamp"].dt.dayofweek
df["Rush_Hour_Indicator"] = ((df["Hour"].between(7, 9)) | (df["Hour"].between(17, 19))).astype(int)
df = pd.get_dummies(df, columns=["Weather_Conditions"], drop_first=True)


@app.route("/predict", methods=["POST"])
def predict():
    if df is None or model is None:
        return jsonify({"Error": "Model not loaded."}), 500

    data = request.json
    if not data:
        return jsonify({"Error": "No input provided"}), 400

    current_location = data.get("current_location")
    destination = data.get("destination")
    datetime_str = data.get("datetime")

    # Validate datetime
    try:
        dt = datetime.fromisoformat(datetime_str)
        hour = dt.hour
        day_of_week = dt.weekday()
    except Exception:
        return jsonify({"Error": "Invalid datetime format."}), 400

    if current_location not in df["Location"].unique() or destination not in df["Location"].unique():
        return jsonify({"Error": "Invalid location(s)."}), 404

    filtered_data = df[(df["Location"] == current_location) & (df["Hour"] == hour)]
    if filtered_data.empty:
        closest_idx = df[(df["Location"] == current_location)]["Hour"].sub(hour).abs().idxmin()
        filtered_data = df.iloc[[closest_idx]]

    if filtered_data.empty:
        return jsonify({"Error": "No data available for this location/time."}), 404

    # --- Prepare model input ---
    input_data = {
        "Traffic_Flow_Speed": filtered_data["Traffic_Flow_Speed"].mean(),
        "Vehicle_Count": filtered_data["Vehicle_Count"].mean(),
        "Hour": hour,
        "Day_of_Week": day_of_week,
        "Rush_Hour_Indicator": int(7 <= hour <= 9 or 17 <= hour <= 19),
        "NO2_Emissions": filtered_data["NO2_Emissions"].mean()
    }

    for col in feature_columns:
        if col.startswith("Weather_Conditions_") and col not in input_data:
            input_data[col] = filtered_data[col].mean() if col in filtered_data.columns else 0

    input_df = pd.DataFrame([input_data])
    input_df = input_df.reindex(columns=feature_columns, fill_value=0)

    # --- Make prediction ---
    input_scaled = scaler_X.transform(input_df).reshape((1, 1, len(feature_columns)))
    prediction = model.predict(input_scaled)[0][0]
    congestion_prob = prediction * (1.8 if input_data["Rush_Hour_Indicator"] else 1)
    is_congested = congestion_prob > 0.5

    if is_congested:
        valid_routes = df[df["Location"] == current_location]["Suggested_Route_Adjustment"]
        valid_routes = valid_routes[~valid_routes.isin(["No change needed", ""])].dropna().tolist()
        suggestion = np.random.choice(valid_routes) if valid_routes else "Take small connecting roads"
        return jsonify({
            "Congestion": "High",
            "Congestion_Probability": round(congestion_prob * 100, 2),
            "Suggested_Alternative_Route": suggestion
        })
    else:
        return jsonify({
            "Congestion": "Low",
            "Congestion_Probability": round(congestion_prob * 100, 2),
            "Suggested_Route": "Your selected route is fine."
        })


if __name__ == "__main__":
    # app.run(debug=True)
    app.run(host="0.0.0.0", port=5005, debug=True)  # Bind to all hosts