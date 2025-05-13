import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDesktop,
  faChartColumn,
  faMapLocationDot,
  faPieChart,
  faChartBar,
  faTachometerAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./visualisedata.css"

function VisualData() {
  const [selectedChart, setSelectedChart] = useState("");

  const handleChartChange = (event) => {
    setSelectedChart(event.target.value);
  };

  return (
    <div className="dropdown-container">
      <label htmlFor="chart-select">
        <FontAwesomeIcon icon={faDesktop} /> Visualize Data:
      </label>
      <select
        id="chart-select"
        value={selectedChart}
        onChange={handleChartChange}
        className="chart-dropdown"
      >
        <option value="">Select a chart</option>
        <option value="pie-chart">
          <FontAwesomeIcon icon={faPieChart} /> Pie Chart
        </option>
        <option value="bar-chart">
          <FontAwesomeIcon icon={faChartColumn} /> Bar Chart
        </option>
        <option value="heat-map">
          <FontAwesomeIcon icon={faMapLocationDot} /> Heat Map
        </option>
        <option value="stacked-bar">
          <FontAwesomeIcon icon={faChartBar} /> Stacked Bar
        </option>
        <option value="gauge-chart">
          <FontAwesomeIcon icon={faTachometerAlt} /> Gauge Chart
        </option>
      </select>

      {/* Optional: Display selected chart */}
      {selectedChart && (
        <div className="selected-chart">Selected: {selectedChart}</div>
      )}
    </div>
  );
}

export default VisualData;
