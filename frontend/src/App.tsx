import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [weekly_mileage, set_weekly_mileage] = useState([]);
  const [weekly_pace, set_weekly_pace] = useState([]);
  const [personal_record, set_personal_record] = useState([]);


  useEffect(() => {
    async function load_data() {
      const response = await fetch("http://54.161.21.214:3000/stats/weekly-mileage");
      const data = await response.json();
      set_weekly_mileage(data);

      const pace_response = await fetch("http://54.161.21.214:3000/stats/pace-trend");
      const pace_data = await pace_response.json();
      set_weekly_pace(pace_data);

      const record_response = await fetch("http://54.161.21.214:3000/stats/personal-record-5k");
      const record_data = await record_response.json();
      set_personal_record(record_data);

    }
    load_data();

  }, [])


  return (
    <div className="app">
      <h2>Weekly Mileage</h2>
      <ul>
        {weekly_mileage.map((one_week) => (
          <li key={one_week.week}>
            {new Date(one_week.week).toLocaleDateString()} — {Number(one_week.total_distance_km).toFixed(2)} km
          </li>
        ))}
      </ul>

      <h2>Weekly Pace</h2>
      <ul>
        {weekly_pace.map((one_week) => (
          <li key={one_week.week}>
            {new Date(one_week.week).toLocaleDateString()} — {one_week.avg_pace_min_per_km} min/km
          </li>
        ))}
      </ul>

      <h2>Fastest 5K</h2>
      <ul>
        {personal_record.map((one_week) => (
          <li key={one_week.activity_name}>
            {one_week.activity_name}: {(Number(one_week.distance) / 1000).toFixed(2)} km in{" "}
            {Math.floor(one_week.moving_time / 60)}:{String(one_week.moving_time % 60).padStart(2, "0")}
          </li>
        ))}
      </ul>
    </div>
);
}

export default App
