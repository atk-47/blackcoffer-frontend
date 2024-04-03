import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const Histogram = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from Flask backend using Axios
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/intensity-by-country'); // Update the endpoint URL accordingly
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  
  console.log(data)
  useEffect(() => {
    if (data && data.length > 0) {
        
      const svg = d3.select(svgRef.current);

      // Define dimensions
      const width = 800;
      const height = 500;

      // Create scales
      const xScale = d3.scaleBand()
        .domain(data.map(d => d.country))
        .range([0, width])
        .padding(0.2);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([height, 0]);

      // Create x-axis
      svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");

      // Create y-axis
      svg.append("g")
        .call(d3.axisLeft(yScale));

      // Create bars
      svg.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("x", d => xScale(d.country))
        .attr("y", d => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.value))
        .attr("fill", "steelblue");
    }
  }, [data]);

  return (
    <svg ref={svgRef} width={800} height={500}></svg>
  );
};

export default Histogram;
