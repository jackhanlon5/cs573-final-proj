import { csvParse, select } from 'd3';
import { stackedBarChart } from './stackedBarChart';
import { data } from '@jackhanlon5/4770362d5ec5458f8ff8dc01878d22a4';

export const main = (container, { state, setState }) => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const svg = select(container)
    .selectAll('svg')
    .data([null])
    .join('svg')
    .attr('width', width)
    .attr('height', height);

  const { hoveredValue, sortBy } = state; // Destructure sortBy from the state

  const setHoveredValue = (d) => {
    setState((state) => ({
      ...state,
      hoveredValue: d,
    }));
  };

  // Calculate the total stats for STL, BLK, and DRB for each player
  const totalStatsData = data.map((d) => ({
    ...d,
    totalStats: d.STL + d.BLK + d.DRB, // Sum of the defensive stats
    normalizedTotal:
      d.STL / Math.max(...data.map((d) => d.STL)) +
      d.BLK / Math.max(...data.map((d) => d.BLK)) +
      d.DRB / Math.max(...data.map((d) => d.DRB)),
  }));

  // Sorting function based on the selected criterion
  const sortedData = totalStatsData
    .sort((a, b) => {
      switch (sortBy) {
        case 'totalStats':
          return b.totalStats - a.totalStats; // Sort by sum of STL, BLK, DRB
        case 'normalizedTotal':
          return b.normalizedTotal - a.normalizedTotal; // Sort by normalized total stats
        default:
          return b.totalStats - a.totalStats; // Default: Sort by total stats
      }
    })
    .slice(0, 15); // Top 15 players based on selected sorting criterion

  // Update the chart with sorted data
  svg.call(stackedBarChart, {
    data: sortedData, // Use sorted data here
    width,
    height,
    xValue: (d) => d.Player,
    yValues: ['STL', 'BLK', 'DRB'],
    xAxisLabel: 'Player',
    yAxisLabel: 'Defensive Stats',
    colorLegendLabel: 'Stats Type',
    setHoveredValue,
    hoveredValue,
    margin: { top: 10, right: 10, bottom: 100, left: 50 },
    colorLegendX: width - 150,
    colorLegendY: 50,
  });

  // Update the sortBy state when the user selects a different sorting option
  const handleSortChange = (newSortBy) => {
    setState((state) => ({
      ...state,
      sortBy: newSortBy,
    }));
  };

  // Create the dropdown for sorting options, positioned just below the color legend
  const dropdown = select(container)
    .append('select') // Append the select element
    .attr('class', 'sort-dropdown') // Add class for styling
    .attr(
      'style',
      `position: absolute; top: ${50 + 50 + 50}px; left: ${width - 200}px; padding: 3px;`,
    ) // Positioned 10px below the color legend
    .on('change', (event) =>
      handleSortChange(event.target.value),
    ); // Listen for changes in selection

  // Append options to the dropdown
  dropdown
    .selectAll('option')
    .data(['totalStats', 'normalizedTotal'])
    .join('option')
    .attr('value', (d) => d)
    .text((d) =>
      d === 'totalStats'
        ? 'Sort by Total Stats'
        : 'Sort by Normalized Stats',
    );
};
