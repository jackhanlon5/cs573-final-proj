// script.js

// Global variables to store data
let teamStats = {};
let teamLocations = {};
let mapData = {};
let selectedStat = 'PTS'; // Default statistic

// Load data and create visualization
Promise.all([
  d3.csv('nba_player_data.csv'),
  d3.json('team_locations.json'),
  d3.json(
    'https://gist.githubusercontent.com/almccon/c5464c81f3437808eb7f9c296e71b51a/raw/us_canada_states_provinces.geojson',
  ),
])
  .then(([playerData, locations, map]) => {
    // Store data globally
    teamLocations = locations;
    mapData = map;

    // Process data
    teamStats = processPlayerData(playerData);

    // Create initial visualization
    createVisualization();
  })
  .catch((error) => {
    console.error('Error loading data:', error);
  });

// Function to process player data and aggregate stats per team
function processPlayerData(data) {
  const stats = {};

  data.forEach((d) => {
    // Handle players with multiple teams
    const teams = d.Tm.split('/');
    const statsList = ['PTS', 'AST', 'TRB', 'STL', 'BLK'];

    teams.forEach((team) => {
      if (!stats[team]) {
        stats[team] = {
          PTS: 0,
          AST: 0,
          TRB: 0,
          STL: 0,
          BLK: 0,
        };
      }
      statsList.forEach((stat) => {
        const value = parseFloat(d[stat]);
        if (!isNaN(value)) {
          stats[team][stat] += value / teams.length; // Divide equally among teams
        }
      });
    });
  });

  console.log('Team Stats:', stats); // For debugging
  return stats;
}

// Function to create the visualization
function createVisualization() {
  // Remove existing SVG if any
  d3.select('#map-container').select('svg').remove();

  const svg = d3.select('#map-container').append('svg');

  const width = svg.node().getBoundingClientRect().width;
  const height = svg.node().getBoundingClientRect().height;

  // Use a projection suitable for both USA and Canada
  const projection = d3
    .geoAlbersUsa()
    .scale(1000)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath().projection(projection);

  // Draw the map
  svg
    .append('g')
    .selectAll('path')
    .data(mapData.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', '#ddd')
    .attr('stroke', '#999');

  // Get stats for the selected statistic
  const statValues = Object.values(teamStats).map(
    (d) => d[selectedStat],
  );
  const maxStat = d3.max(statValues) || 1;
  const minStat = d3.min(statValues) || 0;

  // Define color scales for each statistic
  const colorInterpolators = {
    PTS: d3.interpolateReds,
    AST: d3.interpolateOranges,
    TRB: d3.interpolatePurples,
    STL: d3.interpolateGreens,
    BLK: d3.interpolateBlues,
  };

  const colorScale = d3
    .scaleSequential(colorInterpolators[selectedStat])
    .domain([minStat, maxStat]);

  // Set a fixed, smaller radius for all circles
  const circleRadius = 8; // Adjust as needed

  // Plot teams
  Object.keys(teamLocations).forEach((team) => {
    const location = teamLocations[team];
    const stat = teamStats[team][selectedStat] || 0;

    const coords = projection([location[1], location[0]]);
    if (!coords) {
      console.warn(
        `Projection returned null for team ${team}`,
      );
      return;
    }

    // Plot circle with fixed radius
    svg
      .append('circle')
      .attr('cx', coords[0])
      .attr('cy', coords[1])
      .attr('r', circleRadius)
      .attr('fill', colorScale(stat))
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('opacity', 0.7);

    // Add team abbreviation
    svg
      .append('text')
      .attr('x', coords[0])
      .attr('y', coords[1] - circleRadius - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', 'black')
      .text(team);
  });

  // Add legend
  createLegend(svg, colorScale, minStat, maxStat, width);
}

// Function to create the legend
function createLegend(
  svg,
  colorScale,
  minStat,
  maxStat,
  width,
) {
  const legendWidth = 20;
  const legendHeight = 200;
  const legendMargin = { top: 20, right: 20 };

  // Define the gradient
  const defs = svg.append('defs');

  const gradient = defs
    .append('linearGradient')
    .attr('id', 'legendGradient')
    .attr('x1', '0%')
    .attr('y1', '100%') // Start at the bottom
    .attr('x2', '0%')
    .attr('y2', '0%'); // End at the top

  // Create gradient stops
  const gradientStops = d3.range(
    minStat,
    maxStat + 1,
    (maxStat - minStat) / 100,
  );

  gradientStops.forEach((value, i) => {
    gradient
      .append('stop')
      .attr(
        'offset',
        `${(i / (gradientStops.length - 1)) * 100}%`,
      )
      .attr('stop-color', colorScale(value));
  });

  // Position the legend
  const legendGroup = svg
    .append('g')
    .attr(
      'transform',
      `translate(${width - legendWidth - (legendMargin.right + 50)}, ${legendMargin.top + 25})`,
    );

  // Draw the legend rectangle
  legendGroup
    .append('rect')
    .attr('width', legendWidth)
    .attr('height', legendHeight)
    .style('fill', 'url(#legendGradient)')
    .attr('stroke', 'black')
    .attr('stroke-width', 1);

  // Create a scale for the legend axis
  const legendScale = d3
    .scaleLinear()
    .domain([minStat, maxStat])
    .range([legendHeight, 0]);

  // Add legend axis
  const legendAxis = d3.axisRight(legendScale).ticks(5);

  legendGroup
    .append('g')
    .attr('transform', `translate(${legendWidth}, 0)`)
    .call(legendAxis)
    .selectAll('text')
    .attr('font-size', '12px');

  // Optional: Add a title to the legend
  legendGroup
    .append('text')
    .attr('x', legendWidth / 2)
    .attr('y', -10)
    .attr('text-anchor', 'middle')
    .attr('font-size', '14px')
    .attr('font-weight', 'bold')
    .text(selectedStat);
}

// Event listener for the statistic selector
d3.select('#stat-selector').on('change', function () {
  selectedStat = this.value;
  createVisualization();
});
