function offsetLocation(lat, lon, offset) {
  const xOffset = 0.1 * offset; // small offset on the longitude
  const yOffset = 0.05 * offset; // small offset on the latitude
  return [lat + yOffset, lon + xOffset];
}

function draw() {
  const svg = d3.select('svg');
  const projection = d3
    .geoAlbersUsa()
    .scale(1000)
    .translate([480, 300]); // Center the map
  const path = d3.geoPath().projection(projection);

  const circleRadiusSqrt = d3
    .scaleSqrt()
    .domain([0, 2000])
    .range([0, 30]);
  const circleRadiusClassed = d3
    .scaleThreshold()
    .domain([0, 500, 1000, 1500, 2000])
    .range([1, 5, 10, 15, 20]);

  let scaling = 'classed'; // You can change this to 'proportional' if needed

  svg.selectAll('circle').remove();
  svg.selectAll('text').remove();

  // Add the map outline for the U.S. and Canada
  d3.json(
    'https://enjalot.github.io/wwsd/data/world/world-110m.geojson',
  ).then(function (world) {
    svg.selectAll('path').remove();
    svg
      .append('path')
      .attr('d', path(world))
      .attr('fill', 'none')
      .attr('stroke', 'white');

    // Add state and province outlines
    d3.json(
      'https://gist.githubusercontent.com/almccon/c5464c81f3437808eb7f9c296e71b51a/raw/eb8f5489ee3023f60525cc7487d403fbf48582f6/us_canada_states_provinces.geojson',
    ).then(function (states) {
      svg
        .append('path')
        .attr('d', path(states))
        .attr('fill', 'none')
        .attr('stroke', 'black');

      // Plot team locations with circle sizes based on points
      const teamCounter = {};

      Object.keys(teamLocations).forEach(function (team) {
        if (!selectedTeams.has(team)) return;

        const location = teamLocations[team];
        teamCounter[team] = (teamCounter[team] || 0) + 1;
        const offset = teamCounter[team] - 1;

        // Apply an offset to prevent circles from overlapping
        const offsetLocationCoords = offsetLocation(
          location[0],
          location[1],
          offset,
        );

        const points = Math.random() * 2000; // Replace this with real player points per team
        const circleRadius =
          scaling === 'proportional'
            ? circleRadiusSqrt
            : circleRadiusClassed;

        // Different color for teams at the same location
        const color =
          offset === 0
            ? 'red'
            : d3.schemeCategory10[offset % 10];

        // Append circle representing the team's location
        svg
          .append('circle')
          .attr(
            'cx',
            projection([
              offsetLocationCoords[1],
              offsetLocationCoords[0],
            ])[0],
          )
          .attr(
            'cy',
            projection([
              offsetLocationCoords[1],
              offsetLocationCoords[0],
            ])[1],
          )
          .attr('r', circleRadius(points))
          .attr('fill', color)
          .attr('opacity', 0.7)
          .attr('stroke', 'blue')
          .attr('stroke-width', 1);

        // Add team abbreviations as labels
        svg
          .append('text')
          .attr(
            'x',
            projection([
              offsetLocationCoords[1],
              offsetLocationCoords[0],
            ])[0] - 12,
          ) // Offset to the right of the circle
          .attr(
            'y',
            projection([
              offsetLocationCoords[1],
              offsetLocationCoords[0],
            ])[1] - 15,
          ) // Vertically center the text
          .text(team)
          .attr('fill', 'black');

        // Add the circle radii as text under the abbreviation
        svg
          .append('text')
          .attr(
            'x',
            projection([
              offsetLocationCoords[1],
              offsetLocationCoords[0],
            ])[0] - 12,
          )
          .attr(
            'y',
            projection([
              offsetLocationCoords[1],
              offsetLocationCoords[0],
            ])[1] - 5,
          ) // Offset below the team abbreviation
          .text(`r: ${Math.round(circleRadius(points))}`)
          .attr('fill', 'black');
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const width = window.innerWidth * 0.7; // 70% of screen width
  const height = window.innerHeight; // Full screen height

  // Dynamically create the SVG element and append to the body
  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background-color', '#f0f0f0'); // Background for debugging

  // Define the projection
  const projection = d3
    .geoAlbersUsa()
    .scale(1000)
    .translate([480, 300]); // Center the map
  const path = d3.geoPath().projection(projection);

  // Load the map data (check if the data is properly loaded)
  d3.json(
    'https://enjalot.github.io/wwsd/data/world/world-110m.geojson',
  )
    .then(function (world) {
      svg.selectAll('path').remove();
      svg
        .append('path')
        .attr('d', path(world))
        .attr('fill', 'none')
        .attr('stroke', 'white');

      // Add state and province outlines
      d3.json(
        'https://gist.githubusercontent.com/almccon/c5464c81f3437808eb7f9c296e71b51a/raw/eb8f5489ee3023f60525cc7487d403fbf48582f6/us_canada_states_provinces.geojson',
      ).then(function (states) {
        svg
          .append('path')
          .attr('d', path(states))
          .attr('fill', 'none')
          .attr('stroke', 'black');

        draw(); // Now we can call draw after the map is rendered
      });
    })
    .catch(function (error) {
      console.error('Error loading map data:', error); // Log any errors in loading map data
    });
});
