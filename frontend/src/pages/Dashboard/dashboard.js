import React, { useState, useEffect } from "react"; // Correct import for useEffect
import { useNavigate } from "react-router-dom"; // Correct import for useNavigate
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Plot from "react-plotly.js"; // Correct import statement
import {
  faHouse,
  faDesktop,
  faBell,
  faChartColumn,
  faMapLocationDot,
  faHeartPulse,
  faPieChart,
  faChartBar,
  faTachometerAlt,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import "./dashboard.css";
import GaugeChart from "react-gauge-chart";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat"; // Import leaflet.heat plugin

class HeatMap extends React.Component {
  componentDidMount() {
    // Initialize the map centered on Faisalabad
    this.map = L.map("heatmap").setView([30.7628, 72.9297], 10);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(this.map);

    // Fetch AQI data from the JSON file
    fetch("/aqidata.json") // Replace with the actual path to your JSON file
      .then((response) => response.json())
      .then((data) => {
        // Validate and process the JSON structure
        if (!data || !Array.isArray(data.features)) {
          throw new Error("Invalid data structure");
        }

        // Prepare the data for the heatmap
        const aqiData = [];
        data.features.forEach((feature) => {
          const { AQI, lat, long } = feature.attributes; // Extract AQI and coordinates

          // Determine intensity based on AQI value for heatmap
          const getIntensity = (aqi) => {
            if (aqi <= 224.890014) return 0.6; // Moderate AQI (yellow zone)
            if (aqi <= 226.57779) return 0.8; // Very Unhealthy AQI (red zone)
            return 1.0; // Hazardous AQI (maroon zone)
          };

          // Push the [lat, long, intensity] format to the aqiData array
          aqiData.push([lat, long, getIntensity(AQI)]);
        });
        // Add heatmap layer
        L.heatLayer(aqiData, {
          radius: 25, // Radius of each heatmap point
          blur: 15, // Blur effect intensity
          maxZoom: 13, // Maximum zoom level
          gradient: {
            0.4: "blue", // Low intensity
            0.6: "lime", // Moderate intensity
            0.7: "yellow", // Higher intensity
            0.8: "orange", // Very high intensity
            1.0: "red", // Maximum intensity
          },
        }).addTo(this.map);
      })
      .catch((error) => {
        console.error("Error loading AQI data:", error);
      });
  }

  componentWillUnmount() {
    if (this.map) {
      this.map.remove();
    }
  }

  render() {
    return <div id="heatmap" style={{ width: "100%", height: "400px" }}></div>;
  }
}




function Dashboard() {
  const navigate = useNavigate();

  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [predictedAqi, setPredictedAqi] = useState("N/A");
  const [jsonData, setJsonData] = useState(null); // To store your JSON data
  const [locations, setLocations] = useState([]); // To store locations
  const [selectedLocation, setSelectedLocation] = useState(null); // To store selected location
  const [healthAdvice, setHealthAdvice] = useState(""); // Store health advice based on AQI

  const [currentLocation, setCurrentLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [datetime, setDatetime] = useState("");
  const [result, setResult] = useState("");
  const [resultClass, setResultClass] = useState("");

  // const handleDropdownChange = (e, type) => {
  //   const newLocation = e.target.value;
  //   if (type === "location") {
  //     setCurrentLocation(newLocation);
  //   } else if (type === "destination") {
  //     setDestination(newLocation);
  //   }
  // };

  const [phoneNumber, setPhoneNumber] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [alertTime, setAlertTime] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const scheduleAlert = () => {
    fetch("http://127.0.0.1:5006/schedule-alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phoneNumber,
        current_location: currentLocation,
        destination,
        departure_time: departureTime,
        alert_time: alertTime,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setResponseMessage(
          data.success
            ? "✅ Alert Scheduled Successfully!"
            : "❌ Failed to schedule alert: " + data.error
        );
      })
      .catch((error) => {
        setResponseMessage("❌ Could not connect to server.");
      });
  };

  const predictTraffic = () => {
    setResult("Predicting...");
    setResultClass("result");

    fetch("http://localhost:5005/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        current_location: currentLocation,
        destination,
        datetime,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Error) {
          setResult(data.Error);
          setResultClass("result error");
        } else if (data.Congestion === "High") {
          setResult(
            `🚦 High Congestion!\nSuggested Route: ${data.Suggested_Alternative_Route}`
          );
          setResultClass("result high-congestion");
        } else {
          setResult(`✅ Low Congestion\n${data.Suggested_Route}`);
          setResultClass("result low-congestion");
        }
      })
      .catch((error) => {
        setResult(`Error: ${error}`);
        setResultClass("result error");
      });
  };

  const [showInfopie, setShowInfopie] = useState(false);

  const handleToggleInfopie = () => {
    setShowInfopie(!showInfopie);
  };

  const [showInfoPM, setShowInfoPM] = useState(false);

  const handleToggleInfoPM = () => {
    setShowInfoPM(!showInfoPM);
  };

  const [showInfoCO2, setShowInfoCO2] = useState(false);

  const handleToggleInfoCO2 = () => {
    setShowInfoCO2(!showInfoCO2);
  };
  const [showInfoTempHum, setShowInfoTempHum] = useState(false);

  const handleToggleInfoTempHum = () => {
    setShowInfoTempHum(!showInfoTempHum);
  };

  const [showInfoPollutant, setShowInfoPollutant] = useState(false);

  const handleToggleInfoPollutant = () => {
    setShowInfoPollutant(!showInfoPollutant);
  };
  const [showInfoPollutants, setShowInfoPollutants] = useState(false);

  const handleToggleInfoPollutants = () => {
    setShowInfoPollutants(!showInfoPollutants);
  };
  const [showInfoAQI, setShowInfoAQI] = useState(false);

  const handleToggleInfoAQI = () => {
    setShowInfoAQI(!showInfoAQI);
  };

  const [showInfoHeatMap, setShowInfoHeatMap] = useState(false);

  const handleToggleInfoHeatMap = () => {
    setShowInfoHeatMap(!showInfoHeatMap);
  };

  const [pollutionData, setPollutionData] = useState({
    pm25: 80,
    pm10: 150,
    co2: 400,
  }); // Simulated pollution data

  // Calculate the highest pollution level percentage
  const calculatePollutionPercentage = () => {
    const highestPollutant = Math.max(
      pollutionData.pm25,
      pollutionData.pm10,
      pollutionData.co2
    );
    const maxPollutionLevel = 500; // Maximum possible value
    return (highestPollutant / maxPollutionLevel) * 100;
  };

  const pollutionPercentage = calculatePollutionPercentage();

  // Set up periodic notifications (just for demonstration purposes)
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     const currentTime = new Date().toISOString();
  //     alerts.forEach((alert) => {
  //       // Check if current time matches the alert time
  //       if (alert.time === currentTime) {
  //         console.log(`Alert triggered: ${alert.name}`);
  //         // You can replace this log with an actual notification logic
  //       }
  //     });
  //   }, 1000); // Check every second for simplicity
  //   return () => clearInterval(intervalId); // Clean up interval on unmount
  // }, [alerts]);

  useEffect(() => {
    // Fetch the data from JSON
    fetch("csvjson.json") // Replace with actual file path or API
      .then((response) => response.json())
      .then((data) => {
        setJsonData(data);
        // Extract unique locations
        const uniqueLocations = [
          ...new Set(data.map((record) => record.Location)),
        ];
        setLocations(uniqueLocations);
        setSelectedLocation(uniqueLocations[0]); // Set default location
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleLocationChange = (event) => {
    const newLocation = event.target.value;
    setSelectedLocation(newLocation);

    // Update the query parameters without reloading the page
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("location", newLocation);

    const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
  };
  useEffect(() => {
    if (jsonData && selectedLocation) {
      updateCharts(selectedLocation);
    }
  }, [selectedLocation, jsonData]);

  const updateCharts = (selectedLocation) => {
    const filteredData = jsonData.filter(
      (record) => record.Location === selectedLocation
    );
    const timeRange = filteredData.map((record) => record.Date);
    const pm25Data = filteredData.map((record) => record["PM2.5"]);
    const pm10Data = filteredData.map((record) => record["PM10"]);
    const co2Data = filteredData.map((record) => record.CO2);
    const tempData = filteredData.map((record) => record.Temperature);
    const humidData = filteredData.map((record) => record.Humidity);

    // Update chart data state
    setChartsData({
      timeRange,
      pm25Data,
      pm10Data,
      co2Data,
      tempData,
      humidData,
    });

    // const avgPM25 = (
    //   pm25Data.reduce((a, b) => a + b, 0) / pm25Data.length
    // ).toFixed(2);
    // const avgPM10 = (
    //   pm10Data.reduce((a, b) => a + b, 0) / pm10Data.length
    // ).toFixed(2);
    // const avgCO2 = (
    //   co2Data.reduce((a, b) => a + b, 0) / co2Data.length
    // ).toFixed(2);

    //  const averageAQI = Math.max(avgPM25, avgPM10, avgCO2);
    //  const advice = getHealthAdvice(averageAQI, avgPM25, avgPM10, avgCO2);
    // setHealthAdvice(advice);
  };

  const [chartsData, setChartsData] = useState({
    timeRange: [],
    pm25Data: [],
    pm10Data: [],
    co2Data: [],
    tempData: [],
    humidData: [],
  });

  // Filter data for the selected location
  const filteredData = jsonData
    ? jsonData.filter((record) => record.Location === selectedLocation)
    : [];

  if (!jsonData || locations.length === 0) {
    return <div>Loading data...</div>;
  }

  // Data preparation
  const timeRange = filteredData.map((record) => record.Date);
  const pm25Data = filteredData.map((record) => record["PM2.5"]);
  const pm10Data = filteredData.map((record) => record["PM10"]);
  const co2Data = filteredData.map((record) => record.CO2);

  const avgPM25 = parseFloat(
    (pm25Data.reduce((a, b) => a + b, 0) / pm25Data.length).toFixed(2)
  );
  const avgPM10 = parseFloat(
    (pm10Data.reduce((a, b) => a + b, 0) / pm10Data.length).toFixed(2)
  );
  const avgCO2 = parseFloat(
    (co2Data.reduce((a, b) => a + b, 0) / co2Data.length).toFixed(2)
  );

  const pieData = [
    { name: "PM2.5", value: avgPM25 },
    { name: "PM10", value: avgPM10 },
    { name: "CO2", value: avgCO2 },
  ];

  const lastDayIndex = timeRange.length - 1;
  const barData = [
    { name: "PM2.5", value: pm25Data[lastDayIndex] },
    { name: "PM10", value: pm10Data[lastDayIndex] },
    { name: "CO2", value: co2Data[lastDayIndex] },
  ];

  const stackedBarData = timeRange.map((time, index) => ({
    name: time,
    PM25: pm25Data[index],
    PM10: pm10Data[index],
    CO2: co2Data[index],
  }));

  const latestAQI = 228.75;
  // const latestAQI = Math.max(
  //   pm25Data[lastDayIndex],
  //   pm10Data[lastDayIndex],
  //   co2Data[lastDayIndex]
  // );

  const maxAQI = 300; // Maximum AQI value
  const gaugeValue = latestAQI / maxAQI; // Maximum AQI value
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!longitude || !latitude) {
      alert("Please enter both longitude and latitude.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5004/predict?longitude=${longitude}&latitude=${latitude}`,
        {
          method: "GET",
          mode: "cors", // Include CORS headers
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.predicted_aqi) {
          setPredictedAqi(data.predicted_aqi.toFixed(2));
          const aqi = parseFloat(predictedAqi);
          const advice = getHealthAdvice(aqi);
          setHealthAdvice(advice);
        } else {
          setPredictedAqi("Error fetching data");
        }
      } else {
        setPredictedAqi("Error fetching data");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "There was an error fetching the AQI prediction. Please try again later."
      );
    }
  };

  const getHealthAdvice = (aqi) => {
    if (aqi <= 50) {
      return {
        advice: "Air quality is good. You can go outside.",
        explanation:
          "Air quality is in the safe range. No precautions are necessary.",
        icon: "✅",
      };
    } else if (aqi <= 100) {
      return {
        advice:
          "Air quality is moderate. Consider limiting outdoor activities.",
        explanation:
          "The air quality is acceptable for most people. Sensitive groups (children, elderly, and people with respiratory issues) should limit prolonged outdoor activities.",
        icon: "⚠️",
      };
    } else if (aqi <= 150) {
      return {
        advice:
          "Air quality is unhealthy for sensitive groups. Stay indoors if you have respiratory issues.",
        explanation:
          "Sensitive groups should avoid prolonged outdoor exertion. If you have asthma or respiratory issues, it's better to stay inside.",
        icon: "🚨",
      };
    } else if (aqi <= 200) {
      return {
        advice: "Air quality is unhealthy. Limit outdoor exposure.",
        explanation:
          "The general population may experience health effects. Everyone should limit outdoor activities, and sensitive groups should stay indoors.",
        icon: "🚷",
      };
    } else if (aqi <= 300) {
      return {
        advice:
          "Air quality is hazardous. Stay indoors and avoid outdoor activities.",
        explanation:
          "Health warnings of emergency conditions. Everyone should avoid outdoor activities, and sensitive groups should remain indoors.",
        icon: "❌",
      };
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo"> Dashboard</div>
        <ul className="sidebar-links">
          <li>
            <a href="#home" onClick={() => navigate("/")}>
              <FontAwesomeIcon icon={faHouse} /> Home
            </a>
          </li>
          <li>
            <a href="#stats">
              <FontAwesomeIcon icon={faDesktop} /> Monitoring Environment
            </a>
          </li>
          <li>
            <a href="#visual-data-section">
              <FontAwesomeIcon icon={faDesktop} /> Visual Data
            </a>
          </li>
          <li>
            <a href="#pie-chart">
              <FontAwesomeIcon icon={faPieChart} /> Pie Chart
            </a>
          </li>
          <li>
            <a href="#bar-chart">
              <FontAwesomeIcon icon={faChartColumn} /> Bar Chart
            </a>
          </li>

          <li>
            <a href="#stacked-bar-chart">
              <FontAwesomeIcon icon={faChartBar} /> Stacked Bar
            </a>
          </li>
          <li>
            <a href="#gauge-chart">
              <FontAwesomeIcon icon={faTachometerAlt} /> Gauge Chart
            </a>
          </li>
          <li>
            <a href="#heat-map">
              <FontAwesomeIcon icon={faMapLocationDot} /> Heat Map
            </a>
          </li>
          <li>
            <a href="#recommendation">
              <FontAwesomeIcon icon={faDesktop} /> Recommendations System
            </a>
          </li>

          <li>
            <a href="#health-impact">
              <FontAwesomeIcon icon={faHeartPulse} /> Health Impact
            </a>
          </li>
          <li>
            <a href="#custom-alerts">
              <FontAwesomeIcon icon={faBell} /> Custom ALerts
            </a>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="dropdown-container">
          <label htmlFor="locationDropdown">Select Location: </label>
          <select
            id="locationDropdown"
            value={selectedLocation || ""}
            onChange={handleLocationChange}
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <section className="stats" id="stats">
          <h2>Monitoring Environment</h2>
          <div className="info-cards-container">
            <div className="info-card">78 Pollution</div>
            <div className="info-card">12 Health</div>
            <div className="info-card">13 Traffic Rush</div>
            <div className="info-card">1 Vehicle</div>
          </div>
        </section>

        <section className="visualize" id="visual-data-section">
          <h2>Visualize Data</h2>

          {/* Pie Chart */}
          <section id="pie-chart" className="chart-card">
            <div className="info-button-container">
              <button onClick={handleToggleInfopie} className="info-button">
                <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
              </button>
            </div>

            {showInfopie && (
              <div className="info-card-piechart">
                <p>
                  <b>PM2.5</b> (Particulate Matter &lt; 2.5µm) are fine
                  particles smaller than 2.5 micrometers that can cause
                  respiratory and cardiovascular problems when inhaled.
                </p>
                <p>
                  <b>PM10</b> (Particulate Matter &lt; 10µm) are particles
                  smaller than 10 micrometers, which can irritate the eyes and
                  respiratory system, and are linked to lung diseases.
                </p>
                <p>
                  <b>CO2</b> is carbon dioxide, a gas produced by breathing and
                  combustion, where high levels can cause discomfort and health
                  issues.
                </p>
              </div>
            )}

            <h3>Average Pollutant Distribution</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={150}
                    fill="#8884d8"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={["#FF6384", "#36A2EB", "#FFCE56"][index]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Plotly PM2.5 and PM10 Chart */}
          <section id="pm25-pm10-chart" className="chart-card">
            <div className="info-button-container">
              <button onClick={handleToggleInfoPM} className="info-button">
                <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
              </button>
            </div>

            {showInfoPM && (
              <div className="info-card-pm">
                <p>
                  The <b>PM2.5</b> and <b>PM10</b> levels chart shows the
                  concentration of particulate matter over time. It helps to
                  compare the levels of PM2.5 and PM10 pollutants.
                </p>
                <p>
                  <b>PM2.5</b> (Particulate Matter &lt; 2.5µm) are fine
                  particles smaller than 2.5 micrometers that can cause
                  respiratory and cardiovascular problems when inhaled.
                </p>
                <p>
                  <b>PM10</b> (Particulate Matter &lt; 10µm) are particles
                  smaller than 10 micrometers, which can irritate the eyes and
                  respiratory system and are linked to lung diseases.
                </p>
                <p>
                  High levels of both PM2.5 and PM10 can significantly impact
                  health, leading to long-term respiratory problems and
                  cardiovascular diseases. Low levels indicate better air
                  quality, but some exposure to moderate levels might still
                  cause health effects, especially for vulnerable groups.
                </p>
              </div>
            )}

            <h3>PM2.5 and PM10 Levels</h3>
            <Plot
              data={[
                {
                  x: chartsData.timeRange,
                  y: chartsData.pm25Data,
                  name: "PM2.5",
                  type: "scatter",
                  line: { color: "#1f77b4" },
                },
                {
                  x: chartsData.timeRange,
                  y: chartsData.pm10Data,
                  name: "PM10",
                  type: "scatter",
                  line: { color: "#ff7f0e" },
                },
              ]}
              layout={{
                title: `PM2.5 and PM10 Levels`,
                xaxis: { title: "Date" },
                yaxis: { title: "Concentration (μg/m³)" },
                margin: { t: 50, l: 50, r: 50, b: 50 },
              }}
            />
          </section>

          {/* Plotly CO2 Levels Chart */}
          <section id="co2-chart" className="chart-card">
            <div className="info-button-container">
              <button onClick={handleToggleInfoCO2} className="info-button">
                <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
              </button>
            </div>

            {showInfoCO2 && (
              <div className="info-card-co2">
                <p>
                  The <b>CO2 Levels</b> chart shows the concentration of carbon
                  dioxide in the air over time. It helps track fluctuations in
                  CO2 levels and provides insights into air quality trends.
                </p>
                <p>
                  <b>CO2</b> is carbon dioxide, a gas produced by breathing and
                  combustion, where high levels can cause discomfort and health
                  issues such as headaches, dizziness, and shortness of breath.
                </p>
                <p>
                  <b>High levels</b> of CO2 (above 1,000 ppm) can indicate poor
                  ventilation and may lead to discomfort or health problems.
                </p>
                <p>
                  <b>Low levels</b> (around 400-500 ppm) are typical in
                  well-ventilated spaces and do not pose any health risk.
                </p>
              </div>
            )}
            <h3>CO2 Levels</h3>
            <Plot
              data={[
                {
                  x: chartsData.timeRange,
                  y: chartsData.co2Data,
                  type: "scatter",
                  line: { color: "#2ca02c" },
                },
              ]}
              layout={{
                title: `CO2 Levels`,
                xaxis: { title: "Date" },
                yaxis: { title: "CO2 Concentration (ppm)" },
                margin: { t: 50, l: 50, r: 50, b: 50 },
              }}
            />
          </section>

          {/* Plotly Temperature & Humidity Chart */}
          <section id="temperature-humidity-chart" className="chart-card">
            {/* Temperature & Humidity Chart */}
            <div className="info-button-container">
              <button onClick={handleToggleInfoTempHum} className="info-button">
                <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
              </button>
            </div>

            {showInfoTempHum && (
              <div className="info-card-temp-hum">
                <p>
                  The <b>Temperature & Humidity</b> chart shows the changes in
                  temperature (°C) and humidity (%) over time. It helps to track
                  weather patterns and fluctuations in both temperature and
                  humidity levels.
                </p>
                <p>
                  <b>Temperature</b>: High temperatures can cause discomfort and
                  heat-related illnesses, while low temperatures can lead to
                  cold-related health issues.
                </p>
                <p>
                  <b>Humidity</b>: High humidity can make the air feel warmer
                  and cause discomfort, while low humidity can lead to dry skin
                  and respiratory problems.
                </p>
                <p>
                  <b>High Temperature</b> levels (above 35°C) can be dangerous,
                  leading to heat stroke or dehydration.
                </p>
                <p>
                  <b>Low Temperature</b> levels (below 0°C) can cause
                  hypothermia and frostbite if prolonged.
                </p>
                <p>
                  <b>High Humidity</b> levels (above 80%) can cause discomfort
                  and may aggravate respiratory conditions.
                </p>
                <p>
                  <b>Low Humidity</b> levels (below 30%) can cause skin dryness
                  and respiratory issues.
                </p>
              </div>
            )}

            <h3>Temperature & Humidity</h3>
            <Plot
              data={[
                {
                  x: chartsData.timeRange,
                  y: chartsData.tempData,
                  type: "scatter",
                  name: "Temperature",
                  line: { color: "#d62728" },
                },
                {
                  x: chartsData.timeRange,
                  y: chartsData.humidData,
                  type: "scatter",
                  name: "Humidity",
                  line: { color: "#9467bd" },
                },
              ]}
              layout={{
                title: "Temperature & Humidity",
                xaxis: { title: "Date" },
                yaxis: { title: "Temperature (°C)" },
                yaxis2: {
                  title: "Humidity (%)",
                  overlaying: "y",
                  side: "right",
                },
                margin: { t: 50, l: 50, r: 50, b: 50 },
              }}
            />
          </section>

          {/* Bar Chart */}
          <section id="bar-chart" className="chart-card">
            {/* Pollutant Levels on the Last Day Chart */}
            <div className="info-button-container">
              <button
                onClick={handleToggleInfoPollutant}
                className="info-button"
              >
                <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
              </button>
            </div>

            {showInfoPollutant && (
              <div className="info-card-pollutant">
                <p>
                  The <b>Pollutant Levels on the Last Day</b> chart displays the
                  concentrations of <b>PM2.5</b>, <b>PM10</b>, and <b>CO2</b>{" "}
                  pollutants measured on the most recent day. It provides a
                  snapshot of air quality for that specific day.
                </p>
                <p>
                  High levels of <b>PM2.5</b> and <b>PM10</b> can be harmful to
                  health, while high <b>CO2</b> levels indicate poor ventilation
                  and discomfort. Low levels of these pollutants are ideal for
                  good air quality.
                </p>
              </div>
            )}

            <h3>Pollutant Levels on the Last Day</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Stacked Bar Chart */}
          <section id="stacked-bar-chart" className="chart-card">
            {/* Pollutants Over Time Chart */}

            <div className="info-button-container">
              <button
                onClick={handleToggleInfoPollutants}
                className="info-button"
              >
                <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
              </button>
            </div>

            {showInfoPollutants && (
              <div className="info-card-pollutants">
                <p>
                  The <b>Pollutants Over Time</b> chart shows the levels of{" "}
                  <b>PM2.5</b>, <b>PM10</b>, and <b>CO2</b> tracked over time.
                  It helps assess changes in air quality by monitoring pollutant
                  concentrations.
                </p>
              </div>
            )}

            <h3>Pollutants Over Time</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stackedBarData} stackOffset="sign">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="PM25" stackId="a" fill="#8884d8" />
                  <Bar dataKey="PM10" stackId="a" fill="#FFCE56" />
                  <Bar dataKey="CO2" stackId="a" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Gauge Chart */}
          <section id="gauge-chart" className="chart-card">
            {/* Air Quality Index Gauge Chart */}
            <div className="info-button-container">
              <button onClick={handleToggleInfoAQI} className="info-button">
                <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
              </button>
            </div>

            {showInfoAQI && (
              <div className="info-card-aqi">
                <p>
                  The <b>Air Quality Index (AQI)</b> chart shows the current
                  level of air pollution. It provides a visual representation of
                  air quality, where lower values indicate good air quality and
                  higher values indicate hazardous air quality.
                </p>
                <p>
                  AQI values are categorized into color-coded ranges by{" "}
                  <b>WHO</b>:
                  <ul>
                    <li>
                      <b>Good (0-50)</b>: Air quality is considered
                      satisfactory, and air pollution poses little or no risk.
                    </li>
                    <li>
                      <b>Moderate (51-100)</b>: Air quality is acceptable;
                      however, some pollutants may pose a moderate risk for a
                      very small number of individuals.
                    </li>
                    <li>
                      <b>Unhealthy for Sensitive Groups (101-150)</b>: Members
                      of sensitive groups, including children and people with
                      respiratory or heart conditions, may begin to experience
                      health effects.
                    </li>
                    <li>
                      <b>Unhealthy (151-200)</b>: Everyone may begin to
                      experience health effects, and members of sensitive groups
                      may experience more serious health effects.
                    </li>
                    <li>
                      <b>Very Unhealthy (201-300)</b>: Health alert; everyone
                      may experience more serious health effects.
                    </li>
                    <li>
                      <b>Hazardous (301-500)</b>: Health warnings of emergency
                      conditions. The entire population is more likely to be
                      affected.
                    </li>
                  </ul>
                </p>
              </div>
            )}

            <h3>Air Quality Index (Latest)</h3>
            <div className="chart-container">
              <GaugeChart
                id="gauge-chart"
                nrOfLevels={20}
                colors={["#4CAF50", "#FFCE56", "#FF5733", "#C70039"]}
                arcWidth={0.3}
                percent={gaugeValue}
                textColor="#000"
                needleColor="#000"
              />
              <div
                style={{
                  textAlign: "center",
                  marginTop: "10px",
                  fontSize: "1.2rem",
                }}
              >
                AQI: {latestAQI}
              </div>
            </div>
          </section>

          {/* Heat Map (Placeholder with ComposedChart) */}
          <section id="heat-map" className="chart-card">
            {/* Heat Map */}
            <div className="info-button-container">
              <button onClick={handleToggleInfoHeatMap} className="info-button">
                <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
              </button>
            </div>

            {showInfoHeatMap && (
              <div className="info-card-heatmap">
                <p>
                  The <b>Heat Map</b> visualizes data density over a
                  geographical area. It uses color gradients to represent the
                  concentration of data points, where warmer colors (like red)
                  indicate higher concentrations, and cooler colors (like blue)
                  indicate lower concentrations.
                </p>
                <p>
                  Heat maps are useful for identifying areas with high or low
                  activity, such as pollution hotspots or areas with increased
                  traffic, helping to make data-driven decisions and track
                  changes over time.
                </p>
              </div>
            )}

            <h3>Heat Map</h3>
            <div className="chart-container">
              <HeatMap />
            </div>
          </section>
        </section>

        <section className="Recommendations-system" id="recommendation">
          <h2>Recommendations System </h2>
          <div className="prediction-system" id="Prediction">
            <h1>Air Quality Index (AQI) Prediction</h1>
            <form className="form-container" onSubmit={handleSubmit}>
              <label className="form-label" htmlFor="longitude">
                Longitude:
              </label>
              <input
                className="form-input"
                type="number"
                step="any"
                id="longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Enter Longitude"
                required
              />

              <label className="form-label" htmlFor="latitude">
                Latitude:
              </label>
              <input
                className="form-input"
                type="number"
                step="any"
                id="latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Enter Latitude"
                required
              />

              <button className="form-button" type="submit">
                Get AQI
              </button>
            </form>

            <div id="result">
              <h3>
                Predicted AQI: <span>{predictedAqi}</span>
              </h3>
            </div>
          </div>

          <div className="traffic-predictor-container">
            <h1>Traffic Congestion Predictor</h1>
            <form className="form-container">
              <label className="form-label">Current Location:</label>
              <input
                className="form-input"
                type="text"
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                placeholder="Enter current location"
                list="location-list"
              />
              <datalist id="location-list">
                {locations
                  .filter((location) =>
                    location
                      .toLowerCase()
                      .includes(currentLocation.toLowerCase())
                  )
                  .map((location, index) => (
                    <option key={index} value={location} />
                  ))}
              </datalist>

              <label className="form-label">Destination:</label>
              <input
                className="form-input"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination"
                list="destination-list"
              />
              <datalist id="destination-list">
                {locations
                  .filter((location) =>
                    location.toLowerCase().includes(destination.toLowerCase())
                  )
                  .map((location, index) => (
                    <option key={index} value={location} />
                  ))}
              </datalist>

              <label className="form-label">Date & Time:</label>
              <input
                className="form-input"
                type="datetime-local"
                value={datetime}
                onChange={(e) => setDatetime(e.target.value)}
              />
              <button className="form-button" onClick={predictTraffic}>
                Predict
              </button>
            </form>
            <div id="result" className={`traffic-result-box ${resultClass}`}>
              {result}
            </div>
          </div>

          <div className="health-impact" id="health-impact">
            <h2>Health Precautions You Must Follow</h2>
            <div className="health-advice-card">
              <div className="card-content">
                <span className="icon">🚴</span>
                <div className="advice-text">
                  <h3>Sensitive groups should reduce outdoor exercise</h3>
                </div>
              </div>
            </div>

            <div className="health-advice-card">
              <div className="card-content">
                <span className="icon">🪟</span>
                <div className="advice-text">
                  <h3>Close your windows to avoid dirty outdoor air</h3>
                </div>
              </div>
            </div>

            <div className="health-advice-card">
              <div className="card-content">
                <span className="icon">😷</span>
                <div className="advice-text">
                  <h3>Sensitive groups should wear a mask outdoors</h3>
                </div>
              </div>
            </div>

            <div className="health-advice-card">
              <div className="card-content">
                <span className="icon">💨</span>
                <div className="advice-text">
                  <h3>Sensitive groups should run an air purifier</h3>
                </div>
              </div>
            </div>
          </div>

          <h2 id="custom-alerts">Custom Alerts</h2>

          {/* Alert Form */}
          <div className="traffic-alerts-form">
            <h2>🚦 Traffic Alert Scheduler</h2>
            <form className="form-container">
              <label>Enter Phone Number:</label>
              <input
                className="form-input"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter Phone Number"
              />

              <label className="form-label">Current Location:</label>
              <input
                className="form-input"
                type="text"
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                placeholder="Enter current location"
                list="location-list"
              />
              <datalist id="location-list">
                {locations
                  .filter((location) =>
                    location
                      .toLowerCase()
                      .includes(currentLocation.toLowerCase())
                  )
                  .map((location, index) => (
                    <option key={index} value={location} />
                  ))}
              </datalist>

              <label className="form-label">Destination:</label>
              <input
                className="form-input"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination"
                list="destination-list"
              />
              <datalist id="destination-list">
                {locations
                  .filter((location) =>
                    location.toLowerCase().includes(destination.toLowerCase())
                  )
                  .map((location, index) => (
                    <option key={index} value={location} />
                  ))}
              </datalist>

              <label className="form-label">Departure Time:</label>
              <input
                className="form-input"
                type="datetime-local"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
              />

              <label className="form-label">Alert Time:</label>
              <input
                className="form-input"
                type="datetime-local"
                value={alertTime}
                onChange={(e) => setAlertTime(e.target.value)}
              />

              <button className="form-button" onClick={scheduleAlert}>
                Schedule Alert
              </button>
            </form>
            <p>{responseMessage}</p>
          </div>
          {/* Pollu
          {/* Pollution Level Alert */}
        </section>
      </main>

      {/* Notifications Section */}
      <section className="notifications">
        <h3>Recent Notifications</h3>
        <div className="notification-grid">
          <div className="notification-card">
            New Health Alert in your area!
          </div>
          <div className="notification-card">
            Traffic levels are high this morning.
          </div>
          <div className="notification-card">
            New air quality forecast is available.
          </div>
          <div className="notification-card">
            Reminder: Update your custom alerts.
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
