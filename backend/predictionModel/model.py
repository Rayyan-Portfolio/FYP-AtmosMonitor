import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import xgboost as xgb

# Load the JSON data
with open('aqidata.json', 'r') as file:
    data = json.load(file)

# Prepare the DataFrame
features = data['features']
data_list = [
    {
        'longitude': feature['attributes']['long'],
        'latitude': feature['attributes']['lat'],
        'AQI': feature['attributes']['AQI']
    }
    for feature in features
]
df = pd.DataFrame(data_list)

# Define features and target variable
X = df[['longitude', 'latitude']]
y = df['AQI']

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Convert data to DMatrix format
dtrain = xgb.DMatrix(X_train, label=y_train)
dtest = xgb.DMatrix(X_test, label=y_test)

# Set XGBoost parameters
params = {
    'objective': 'reg:squarederror',
    'max_depth': 6,
    'eta': 0.1,
    'eval_metric': 'rmse'
}

# Train the model
num_rounds = 100
model = xgb.train(params, dtrain, num_rounds)

# Save the trained model
model.save_model("xgboost_model.json")


