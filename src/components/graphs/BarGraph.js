import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const BarGraph = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]); // Initialize data as an empty array

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/intensity-by-country');
        const dataArray = Object.entries(response.data).map(([country, value]) => ({ country, value }));
        setData(dataArray); // Set the fetched data to state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures it runs once when the component mounts

  console.log(data)
  console.log(typeof(data))
  useEffect(() => {
    if (data.length > 0) {
      const svg = d3.select(svgRef.current);

      const margin = { top: 20, right: 20, bottom: 30, left: 50 };
      const width = 800 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      const x = d3.scaleBand().range([0, width]).padding(0.1);
      const y = d3.scaleLinear().range([height, 0]);

      x.domain(data.map(d => d.country));
      y.domain([0, d3.max(data, d => d.value)]);

      svg.append("g").attr("transform", `translate(${margin.left}, ${height + margin.top})`).call(d3.axisBottom(x));
      svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`).call(d3.axisLeft(y));

      svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.country) + margin.left)
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.value) + margin.top)
        .attr("height", d => height - y(d.value))
        .attr("fill", "steelblue")
        .on("mouseover", function(d) {
          d3.select(this).attr("fill", "orange");
          svg.append("text")
            .attr("class", "hover-text")
            .attr("x", x(d.country) + x.bandwidth() / 2 + margin.left)
            .attr("y", y(d.value) + margin.top - 5)
            .attr("text-anchor", "middle")
            .text(d.value);
        })
        .on("mouseout", function() {
          d3.select(this).attr("fill", "steelblue");
          svg.select(".hover-text").remove();
        });
    }
  }, [data]); // Watch for changes in the data state

  return <svg ref={svgRef} width={800} height={500}></svg>;
};

export default BarGraph;
