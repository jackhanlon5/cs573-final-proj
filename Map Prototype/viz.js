// Much of this forked not from US States with Hover but actually another map "Simulated COVID maps in the US and Canada" linked in the read me.
// Ended up scrapping a lot of that code and merging it with some cool stuff I found on stack overflow and Gemini generated plotting while looking for pre-existing NBA city plots

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
      .translate([480, 300]);
    const path = d3.geoPath().projection(projection);
    const circleRadiusSqrt = d3
      .scaleSqrt()
      .domain([0, 2000])
      .range([0, 30]);
    const circleRadiusClassed = d3
      .scaleThreshold()
      .domain([0, 500, 1000, 1500, 2000])
      .range([1, 5, 10, 15, 20]);
    let scaling = 'classed';
  
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
            .attr('fill', 'red')
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
  