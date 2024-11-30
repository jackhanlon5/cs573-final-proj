document.addEventListener('DOMContentLoaded', function () {
  const teamOptionsDiv =
    document.getElementById('team-options');

  // NBA team locations and coordinates pulled from a list of city lat and longs
  const teamLocations = {
    ATL: [33.749, -84.388],
    BOS: [42.3601, -71.0589],
    BKN: [40.6782, -73.9442],
    CHA: [35.2271, -80.8431],
    CHI: [41.8781, -87.6298],
    CLE: [41.4993, -81.6944],
    DAL: [32.7767, -96.797],
    DEN: [39.7392, -104.9903],
    DET: [42.3314, -83.0458],
    GSW: [37.7749, -122.4194],
    HOU: [29.7604, -95.3698],
    IND: [39.7684, -86.1581],
    LAC: [34.0522, -118.2437],
    LAL: [34.0522, -118.2437],
    MEM: [35.1495, -90.049],
    MIA: [25.7617, -80.1918],
    MIL: [43.0389, -87.9065],
    MIN: [44.9778, -93.265],
    NOP: [29.9511, -90.0715],
    NYK: [40.7128, -74.006],
    OKC: [35.4676, -97.5164],
    ORL: [28.5383, -81.3792],
    PHI: [39.9526, -75.1652],
    PHO: [33.4484, -112.074],
    POR: [45.5152, -122.6784],
    SAC: [38.5816, -121.4944],
    SAS: [29.4241, -98.4936],
    TOR: [43.65107, -79.347015],
    UTA: [40.7608, -111.891],
    WAS: [38.9072, -77.0369],
  };

  // Initialize team selection options
  const selectedTeams = new Set(Object.keys(teamLocations));

  Object.keys(teamLocations).forEach(function (team) {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = 'team';
    input.value = team;
    input.checked = true;
    label.appendChild(input);
    label.appendChild(document.createTextNode(` ${team}`));
    teamOptionsDiv.appendChild(label);

    input.addEventListener('change', function () {
      if (this.checked) {
        selectedTeams.add(this.value);
      } else {
        selectedTeams.delete(this.value);
      }
      draw();
    });
  });

  window.teamLocations = teamLocations;
  window.selectedTeams = selectedTeams;
  draw(); // Initial draw
});
