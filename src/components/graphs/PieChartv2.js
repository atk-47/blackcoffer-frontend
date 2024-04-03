import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const PieChartv2 = () => {
  const [data, setData] = useState(null);
  const svgRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/topics-count');
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
      const width = 450;
      const height = 450;
      const margin = 40;
      const radius = Math.min(width, height) / 2 - margin;

      svg.selectAll('*').remove();

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

      const labelArc = d3.arc().outerRadius(radius + 20).innerRadius(radius + 20);

      g.selectAll('text')
        .data(data_ready)
        .enter()
        .append('text')
        .attr('transform', d => `translate(${labelArc.centroid(d)})`)
        .attr('dy', '.35em')
        .attr('text-anchor', d => midAngle(d) < Math.PI ? 'start' : 'end') // Adjust text-anchor based on angle
        .text(d => d.data.key);

      g.selectAll('polyline')
        .data(data_ready)
        .enter()
        .append('polyline')
        .attr('stroke', 'black')
        .attr('fill', 'none')
        .attr('stroke-width', 1)
        .attr('points', d => {
          const pos = labelArc.centroid(d);
          pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
          return [arcGenerator.centroid(d), labelArc.centroid(d), pos];
        });

      function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
      }

    }

  }, [data]);

  return (
    <svg ref={svgRef} width={500} height={500}></svg>
  );
};

export default PieChartv2;