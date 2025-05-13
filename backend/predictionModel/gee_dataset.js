// Step 1: Define the Region of Interest (Faisalabad) and set up the map
var Faisalabad = ee.Geometry.Point([73.133, 31.491]); // Define the central point for Faisalabad
var FaisalabadRegion = Faisalabad.buffer(20000); // 20 km buffer around Faisalabad

// Center the map over Faisalabad region
Map.centerObject(FaisalabadRegion, 10); // Zoom level 10

// Add a layer to highlight Faisalabad region with a buffer
Map.addLayer(FaisalabadRegion, {color: 'red'}, 'Faisalabad Region');

// Step 2: Use Sentinel-2 Surface Reflectance data for vegetation analysis
var sentinel = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(FaisalabadRegion)
  .filterDate('2023-01-01', '2023-12-31') // Filter by date (adjust as needed)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10)) // Filter for low cloud cover
  .median(); // Take the median pixel value for the year

// Step 3: Calculate NDVI (NDVI = (NIR - Red) / (NIR + Red))
var ndvi = sentinel.normalizedDifference(['B8', 'B4']).rename('NDVI'); // Sentinel bands for NIR and Red

// Threshold NDVI values to detect trees (NDVI > 0.3 typically represents vegetation)
var treeCover = ndvi.gt(0.3).selfMask(); // Only show areas with NDVI > 0.3

// Clip tree cover to the Faisalabad region
var clippedTreeCover = treeCover.clip(FaisalabadRegion);

// Add tree cover layer to the map
Map.addLayer(clippedTreeCover, {palette: ['00FF00']}, 'Tree Cover');


// Preview the first few samples to verify
print(samplePoints.limit(10));

// Step 5: Export the sampled points as a CSV file to Google Drive
Export.table.toDrive({
  collection: samplePoints,
  description: 'Tree_Cover_Faisalabad_CSV',
  fileFormat: 'CSV'
});



// Adding Ozone layer data

// Step 1: Define the Region of Interest (Faisalabad) and set up the map 
var Faisalabad = ee.Geometry.Point([73.133, 31.491]); // Define the central point
var FaisalabadRegion = Faisalabad.buffer(200000); // 1 km buffer around Faisalabad point

// Center the map over Faisalabad region
Map.centerObject(FaisalabadRegion, 7); // Zoom level 7

// Add a layer to highlight Faisalabad region with a buffer
Map.addLayer(FaisalabadRegion, {color: 'red'}, 'Faisalabad Region');


// Step 2: Use Sentinel-5P data for Ozone (O₃) analysis
var ozone = ee.ImageCollection('COPERNICUS/S5P/NRTI/L3_O3') // Sentinel-5P O₃ dataset
  .filterBounds(FaisalabadRegion)
  .filterDate('2023-01-01', '2023-12-31') // Filter by date (adjust as needed)
  .select('O3_column_number_density') // Select O₃ data
  .mean(); // Take the mean for the year

  // Step 3: Clip the O₃ data to the Faisalabad region
var clippedOzone = ozone.clip(FaisalabadRegion);

// Add O₃ data layer to the map
Map.addLayer(clippedOzone, {min: 0, max: 1, palette: [ 'green', 'red']}, 'Ozone Concentration');

// Step 4: Sample the O₃ data to get coordinates and concentration values
var samplePoints = clippedOzone.sample({
  region: FaisalabadRegion,
  scale: 1000, // Resolution (1 km for Sentinel-5P)
  projection: 'EPSG:4326', // Use WGS84 coordinate system (Lat/Long)
  geometries: true // Include geometry (coordinates) in the output
});

// Preview the first few samples to verify
print(samplePoints.limit(10));

// Step 5: Export the sampled points as a CSV file to Google Drive
Export.table.toDrive({
  collection: samplePoints,
  description: 'Ozone_Concentration_Faisalabad_CSV',
  fileFormat: 'CSV'
});