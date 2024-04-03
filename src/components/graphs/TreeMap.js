import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const TreeMap = () => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/intensity-by-country');
        const dataArray = Object.entries(response.data).map(([name, value]) => ({ name, value }));
        setData(dataArray);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const svg = d3.select(svgRef.current);
      const width = 800;
      const height = 500;

      // Define color scale
      const color = d3.scaleOrdinal(d3.schemeCategory10);

      // Create hierarchical data structure
      const root = d3.hierarchy({ children: data })
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

      // Create treemap layout
      const treemap = d3.treemap()
        .size([width, height])
        .padding(1);

      treemap(root);

      // Create nodes
      svg.selectAll('rect')
        .data(root.leaves())
        .enter().append('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', d => color(d.data.name))
        .attr('stroke', 'white');

      // Add text labels
      svg.selectAll('text')
        .data(root.leaves())
        .enter().append('text')
        .attr('x', d => d.x0 + 5)
        .attr('y', d => d.y0 + 20)
        .text(d => d.data.name)
        .attr('font-size', '10px')
        .attr('fill', 'white');
    }
  }, [data]);

  return <svg ref={svgRef} width={800} height={500}></svg>;
};

export default TreeMap;
