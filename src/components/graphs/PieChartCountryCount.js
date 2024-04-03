import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const PieChartCountryCount = () => {
  const [data, setData] = useState(null);
  const svgRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/country-count');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

  }, []);

  useEffect(() => {
    if (data) {
        const svg = d3.select(svgRef.current);
        const width = 200;
        const height = 200;
        const margin = 40
        const radius = Math.min(width, height) / 2 - margin;

        // Clear previous elements from SVG
        svg.selectAll('*').remove();

        // Append a group element ('g') to the SVG to center the pie chart
        const g = svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const pie = d3.pie().value((d) => d.value);
        const data_ready = pie(Object.entries(data).map(([key, value]) => ({ key, value })));

        const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

        g.selectAll('path')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .attr('fill', (d, i) => d3.schemeCategory10[i])
            .attr('stroke', 'black')
            .style('stroke-width', '2px')
            .style('opacity', 0.7);

        const labelArc = d3.arc().outerRadius(radius + 10).innerRadius(radius + 10);
        // Add labels
        g.selectAll('text')
        .data(data_ready)
        .enter()
        .append('text')
        .attr('transform', d => `translate(${labelArc.centroid(d)})`)
        .attr('dy', '.35em')
        .attr('font-size', '10px') 
        .attr('text-anchor', d => midAngle(d) < Math.PI ? 'start' : 'end')
        .text(d => d.data.key); //only text label
        //.text(d => `${d.data.key} (${d.data.value})`); // Display label and count

        
        
        g.selectAll('polyline')
        .data(data_ready)
        .enter()
        .append('polyline')
        .attr('stroke', 'black')
        .attr('fill', 'none')
        .attr('stroke-width', 0.5)
        .attr('points', d => {
          const posA = arcGenerator.centroid(d);
          const posB = labelArc.centroid(d);
          const posC = labelArc.centroid(d);
          posC[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
          return [posA, posB, posC];
        });

        // Function to compute midAngle of pie slice
        function midAngle(d) {
            return d.startAngle + (d.endAngle - d.startAngle) / 2;
        }


    }

  }, [data]);

  return (
    <svg ref={svgRef} width={250} height={250}>
      {/*  */}
    </svg>
  );
};

export default PieChartCountryCount;