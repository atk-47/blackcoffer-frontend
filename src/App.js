import './App.css';
import axios from 'axios';
import AppBarDrawer from './components/AppBarDrawer';
import { useEffect, useState } from 'react';
//import HeatMap from './components/graphs/HeatMap';
import OutlinedCard from './components/OutlinedCard';
import ChoroplethMAp from './components/graphs/ChoroplethMap';
import PieChart from './components/graphs/PieChart';
import HeatMap from './components/graphs/HeatMap';
import PieChartCountryCount from './components/graphs/PieChartCountryCount';
import PieChartSectorCount from './components/graphs/PieChartSectorCount';
import PieChartTopicCount from './components/graphs/PieChartTopicCount';
import BarGraph from './components/graphs/BarGraph';
import BarGraphRelevance from './components/graphs/BarGraphRelevance';
import BarGraphLikelihood from './components/graphs/BarGraphLikelihood';
import TreeMap from './components/graphs/TreeMap';


function App() {
  const [data, setData] = useState([]);
  
  //to test backend is connected sucessfully
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Use D3 to create visualizations
  useEffect(() => {
    // D3 code to create visual representation using the 'data'
    // For simplicity, let's just log the data
    console.log(data);
  }, [data]);

  return (
    <div className="App">
      <AppBarDrawer/>
        <div className="app-container">
          <div className="pie-chart-container">
            <h3>Share of each 'topic'</h3>
            <PieChartTopicCount/>
          </div>
          <div className="pie-chart-container">
            <h3>Country wise distribution</h3>
            <PieChartCountryCount/>
          </div>
          <div className="pie-chart-container">
            <h3>Sector-wise distribution</h3>
            <PieChartSectorCount/>
          </div>
          <div className="pie-chart-container">
            <h3>Sample PieChart</h3>
            <PieChart/>
          </div>   
        </div>
        <div className="app-wide-container">
          <div className="bargraph-container">
            <h3>Intenisty vs Country</h3>
            <BarGraph/>
          </div>
          <div className="bargraph-container">
            <h3>Relevance vs Country</h3>
            <BarGraphRelevance/>
          </div>
          <div className="bargraph-container">
            <h3>likelihood vs Country</h3>
            <BarGraphLikelihood/>
          </div>
          <div className="bargraph-container">
            <h3>Tree Map</h3>
            <TreeMap/>
          </div>
        </div>
    </div>
  );
}

export default App;
