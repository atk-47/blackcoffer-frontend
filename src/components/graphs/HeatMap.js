import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

const HeatMap = () => {
    const [intensity_data, setData] = useState([]);
    const svgRef = useRef(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // const response = await axios.get('http://localhost:5000/intensity-by-country');
                // setData(response.intensity_data);
                fetch('http://localhost:5000/intensity-by-country')  // Update the URL accordingly
                .then(response => response.json())
                .then(intensity_data => {
                    setData(intensity_data);
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
        console.log(intensity_data)
        // Width and height of the SVG container
        const width = 400;
        const height = 250;

        // Create SVG container
        const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height);

        // Projection for the map
        const projection = d3.geoMercator()
        .scale(60)
        .translate([width/2, height/1.5]);

        // Path generator
        const path = d3.geoPath().projection(projection);

        d3.json('https://d3js.org/world-110m.v1.json').then((worldData) => {
        const countries = topojson.feature(worldData, worldData.objects.countries);

        // Draw countries and color them based on the fetched intensity_data
        svg.selectAll('path')
            .data(countries.features)
            .enter().append('path')
            .attr('d', path)
            .attr('fill', d => {
                const countryName = d.properties.name;
                return intensity_data[countryName] ? getColor(intensity_data[countryName]) : 'grey';  // Use getColor function to set color based on value
            });

        });
        console.log(intensity_data["Australia"]);

    }, []);

    // Function to set color based on value
    const getColor = (value) => {
        // Define your color scale based on your requirements
        const colorScale = d3.scaleLinear()
        .domain([0, 1000])  // Update the domain based on your data range
        .range(['lightgrey', 'darkred']);  // Update the range based on your color preference

        return colorScale(value);
    };

    return (
        <svg ref={svgRef}></svg>
    );
};

export default HeatMap;