import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [weekly_mileage, set_weekly_mileage] = useState([]);

  useEffect(() => {
    async function load_data() {
      const response = await fetch("http://54.161.21.214:3000/stats/weekly-mileage");
      const data = await response.json();
      set_weekly_mileage(data);
    }
    load_data();

  }, [])

  console.log(weekly_mileage);

  return (
      <div>
        
      </div>

  );
}

export default App
