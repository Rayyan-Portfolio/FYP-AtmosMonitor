# # import pandas as pd
# # import joblib
# # from sklearn.ensemble import RandomForestClassifier
# # from sklearn.model_selection import train_test_split
# # import os

# # DATASET_PATH = "traffic_pollution_faisalabad_large_2023.csv"
# # PROCESSED_DATASET_PATH = "traffic_processed_data.csv"  # Save preprocessed dataset
# # MODEL_PATH = "traffic_random_forest.pkl"

# # def preprocess_and_train_model():
# #     try:
# #         df = pd.read_csv(DATASET_PATH)
# #     except FileNotFoundError:
# #         print(f"Error: File {DATASET_PATH} not found.")
# #         return

# #     # ✅ Preprocess dataset (Ensure 'Hour', 'Day_of_Week', and 'Rush_Hour_Indicator' exist)
# #     df["Timestamp"] = pd.to_datetime(df["Timestamp"], errors="coerce")
# #     df["Hour"] = df["Timestamp"].dt.hour
# #     df["Day_of_Week"] = df["Timestamp"].dt.dayofweek
# #     df["Rush_Hour_Indicator"] = ((df["Hour"].between(7, 9)) | (df["Hour"].between(17, 19))).astype(int)

# #     df = pd.get_dummies(df, columns=["Weather_Conditions"], drop_first=True)  # Encode categorical features

# #     df["High_Congestion"] = ((df["Vehicle_Count"] > df["Vehicle_Count"].median()) &
# #                             (df["Traffic_Flow_Speed"] < df["Traffic_Flow_Speed"].median())).astype(int)

# #     # Drop unnecessary columns
# #     df = df.drop(columns=["Timestamp", "Latitude", "Longitude"], errors="ignore")

# #     # Save the processed dataset
# #     df.to_csv(PROCESSED_DATASET_PATH, index=False)
# #     print(f"Processed dataset saved at {os.path.abspath(PROCESSED_DATASET_PATH)}")

# #     # Prepare training data
# #     X = df.drop(columns=["Location", "Suggested_Route_Adjustment", "High_Congestion"], errors='ignore')
# #     y = df["High_Congestion"]

# #     X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# #     # Train model
# #     model = RandomForestClassifier(n_estimators=200, max_depth=10, min_samples_split=5, random_state=42)
# #     model.fit(X_train, y_train)

# #     # Save model and feature columns
# #     joblib.dump({"model": model, "features": X_train.columns}, MODEL_PATH)
# #     print(f"Model saved successfully at {os.path.abspath(MODEL_PATH)}")

# # if __name__ == "__main__":
# #     preprocess_and_train_model()

# import pandas as pd
# import joblib
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.model_selection import train_test_split
# import os

# DATASET_PATH = "traffic_pollution_faisalabad_large_2023.csv"
# PROCESSED_DATASET_PATH = "traffic_processed_data_new.csv"  # Updated file name
# MODEL_PATH = "traffic_random_forest_new.pkl"

# def preprocess_and_train_model():
#     try:
#         df = pd.read_csv(DATASET_PATH)
#     except FileNotFoundError:
#         print(f"Error: File {DATASET_PATH} not found.")
#         return

#     # ✅ Ensure Timestamp column exists
#     if "Timestamp" not in df.columns:
#         print("Error: Timestamp column not found in dataset.")
#         return

#     df["Timestamp"] = pd.to_datetime(df["Timestamp"], errors="coerce")
#     df.dropna(subset=["Timestamp"], inplace=True)
#     df["Hour"] = df["Timestamp"].dt.hour
#     df["Day_of_Week"] = df["Timestamp"].dt.dayofweek
#     df["Date"] = df["Timestamp"].dt.date  # New column for tracking daily trends
#     df["Rush_Hour_Indicator"] = ((df["Hour"].between(7, 9)) | (df["Hour"].between(17, 19))).astype(int)

#     df = pd.get_dummies(df, columns=["Weather_Conditions"], drop_first=True)  # Encode categorical features

#     if "Vehicle_Count" in df.columns and "Traffic_Flow_Speed" in df.columns:
#         df["High_Congestion"] = ((df["Vehicle_Count"] > df["Vehicle_Count"].median()) &
#                                   (df["Traffic_Flow_Speed"] < df["Traffic_Flow_Speed"].median())).astype(int)
#     else:
#         print("Error: Required columns for congestion calculation are missing.")
#         return

#     # Drop unnecessary columns but keep Timestamp for reference
#     df = df.drop(columns=["Latitude", "Longitude"], errors="ignore")

#     # Save the processed dataset
#     df.to_csv(PROCESSED_DATASET_PATH, index=False)
#     print(f"Processed dataset saved at {os.path.abspath(PROCESSED_DATASET_PATH)}")

#     # Prepare training data
#     if "High_Congestion" not in df.columns:
#         print("Error: High_Congestion column missing after processing.")
#         return

#     X = df.drop(columns=["Location", "Suggested_Route_Adjustment", "High_Congestion", "Date", "Timestamp"], errors='ignore')
#     y = df["High_Congestion"]

#     X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

#     # Train model
#     model = RandomForestClassifier(n_estimators=200, max_depth=10, min_samples_split=5, random_state=42)
#     model.fit(X_train, y_train)

#     # Save model and feature columns
#     joblib.dump({"model": model, "features": X_train.columns}, MODEL_PATH)
#     print(f"Model saved successfully at {os.path.abspath(MODEL_PATH)}")

# if __name__ == "__main__":
#     preprocess_and_train_model()
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import SimpleRNN, Dense
import joblib
import os

# File paths
DATASET_PATH = "traffic_pollution_faisalabad_large_2023.csv"
PROCESSED_DATASET_PATH = "traffic_processed_data_rnn.csv"
MODEL_PATH = "rnn_high_congestion_model.h5"
SCALER_PATH = "rnn_feature_scaler.pkl"
FEATURES_PATH = "rnn_feature_columns.pkl"

def preprocess_and_train_rnn_model():
    try:
        df = pd.read_csv(DATASET_PATH)
    except FileNotFoundError:
        print(f"Error: File {DATASET_PATH} not found.")
        return

    if "Timestamp" not in df.columns:
        print("Error: Timestamp column not found.")
        return

    # --- Feature Engineering ---
    df["Timestamp"] = pd.to_datetime(df["Timestamp"], errors="coerce")
    df.dropna(subset=["Timestamp"], inplace=True)
    df["Hour"] = df["Timestamp"].dt.hour
    df["Day_of_Week"] = df["Timestamp"].dt.dayofweek
    df["Date"] = df["Timestamp"].dt.date
    df["Rush_Hour_Indicator"] = ((df["Hour"].between(7, 9)) | (df["Hour"].between(17, 19))).astype(int)

    df = pd.get_dummies(df, columns=["Weather_Conditions"], drop_first=True)

    if "Vehicle_Count" in df.columns and "Traffic_Flow_Speed" in df.columns:
        df["High_Congestion"] = ((df["Vehicle_Count"] > df["Vehicle_Count"].median()) &
                                 (df["Traffic_Flow_Speed"] < df["Traffic_Flow_Speed"].median())).astype(int)
    else:
        print("Missing required columns for congestion logic.")
        return

    # Drop irrelevant columns
    df.drop(columns=["Latitude", "Longitude", "Location", "Suggested_Route_Adjustment", "Date", "Timestamp"], inplace=True, errors="ignore")

    # Save processed data
    df.to_csv(PROCESSED_DATASET_PATH, index=False)
    print(f"Processed dataset saved to {os.path.abspath(PROCESSED_DATASET_PATH)}")

    # --- Prepare Data for RNN ---
    if "High_Congestion" not in df.columns:
        print("Error: Target column missing.")
        return

    X = df.drop(columns=["High_Congestion"])
    y = df["High_Congestion"]

    # Save feature column names
    feature_columns = X.columns.tolist()
    joblib.dump(feature_columns, FEATURES_PATH)

    # Scale features
    scaler_X = MinMaxScaler()
    X_scaled = scaler_X.fit_transform(X)
    joblib.dump(scaler_X, SCALER_PATH)

    # Reshape for RNN input
    X_scaled = X_scaled.reshape((X_scaled.shape[0], 1, X_scaled.shape[1]))

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    # Build RNN model
    model = Sequential([
        SimpleRNN(64, activation='relu', input_shape=(X_train.shape[1], X_train.shape[2])),
        Dense(64, activation='relu'),
        Dense(1, activation='sigmoid')  # binary classification
    ])
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

    # Train model
    model.fit(X_train, y_train, epochs=20, batch_size=64, validation_data=(X_test, y_test), verbose=2)

    # Save model
    model.save(MODEL_PATH)
    print(f"RNN model saved to {os.path.abspath(MODEL_PATH)}")

if __name__ == "__main__":
    preprocess_and_train_rnn_model()
 