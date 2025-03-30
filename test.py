import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt

# Load the data
file_path = "karnataka_weather_data.csv"  # Make sure the file is in the same directory
data = pd.read_csv(file_path)

# Display the first few rows of the dataset
print(data.head())

# Features and target variable
X = data[["Temperature (°C)", "Humidity (%)", "Average Rainfall (mm)", "Soil Moisture (%)"]]
y = data["Average Rainfall (mm)"]  # You can change the target to fit your use case (rainfall, moisture, etc.)

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the linear regression model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Model evaluation
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Mean Squared Error: {mse}")
print(f"R² Score: {r2}")

# Visualize predictions vs actual values
plt.scatter(y_test, y_pred, color='blue')
plt.xlabel("Actual Rainfall (mm)")
plt.ylabel("Predicted Rainfall (mm)")
plt.title("Actual vs Predicted Rainfall")
plt.show()
