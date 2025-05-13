import json
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import r2_score

# Load the JSON data
with open('aqidata.json', 'r') as file:
    data = json.load(file)

# Extract attributes and create a DataFrame
features = data['features']
data_list = [
    {
        'OBJECTID': feature['attributes']['OBJECTID'],
        'density': feature['attributes']['density'],
        'longitude': feature['attributes']['long'],
        'latitude': feature['attributes']['lat'],
        'AQI': feature['attributes']['AQI']
    }
    for feature in features
]

df = pd.DataFrame(data_list)

# Display the DataFrame
print(df.head())

# Visualize AQI points on a scatter plot
plt.scatter(df['longitude'], df['latitude'], c=df['AQI'], cmap='viridis', s=50)
plt.colorbar(label='AQI')
plt.xlabel('Longitude')
plt.ylabel('Latitude')
plt.title('Air Quality Index (AQI) Distribution')
plt.show()

import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import xgboost as xgb

# Load the JSON data
with open('aqidata.json', 'r') as file:
    data = json.load(file)

# Extract attributes and create a DataFrame
features = data['features']
data_list = [
    {
        'OBJECTID': feature['attributes']['OBJECTID'],
        'density': feature['attributes']['density'],
        'longitude': feature['attributes']['long'],
        'latitude': feature['attributes']['lat'],
        'AQI': feature['attributes']['AQI']
    }
    for feature in features
]

# Create a DataFrame
df = pd.DataFrame(data_list)

# Define features and target variable
X = df[[ 'longitude', 'latitude']]
y = df['AQI']

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Convert the data to DMatrix format for XGBoost
dtrain = xgb.DMatrix(X_train, label=y_train)
dtest = xgb.DMatrix(X_test, label=y_test)

# Set parameters for XGBoost
params = {
    'objective': 'reg:squarederror',  # For regression tasks
    'max_depth': 6,
    'eta': 0.1,
    'eval_metric': 'rmse'
}

# Train the XGBoost model
num_rounds = 100
bst = xgb.train(params, dtrain, num_rounds)

# Save the trained model to a file
bst.save_model("xgboost_model.json")
print("Model saved successfully as xgboost_model.json")

# Predict on the test set
y_pred = bst.predict(dtest)

# Calculate RMSE
rmse = mean_squared_error(y_test, y_pred, squared=False)
print(f'Root Mean Squared Error: {rmse:.2f}')

# Optionally, display the first few predictions
print("Sample predictions:")
print(y_pred[:10])

# Calculate R² score
r2 = r2_score(y_test, y_pred)
print(f'R² Score: {r2:.2f}')

