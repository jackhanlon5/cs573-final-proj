import { csvParse, select, scaleOrdinal } from 'd3';
import { stackedBarChart } from './stackedBarChart';
import { colorLegend } from './colorLegend';
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

  const { hoveredValue, filteredValue } = state;

  const setHoveredValue = (d) => {
    setState((state) => ({
      ...state,
      hoveredValue: d,
    }));
  };

  const setFilteredValue = (stat) => {
    setState((state) => ({
      ...state,
      filteredValue: stat,
    }));
  };

  // Normalize the data
  const totalStatsData = data.map((d) => ({
    ...d,
    totalStats: d.STL + d.BLK + d.DRB,
    normalizedTotal:
      d.STL / Math.max(...data.map((d) => d.STL)) +
      d.BLK / Math.max(...data.map((d) => d.BLK)) +
      d.DRB / Math.max(...data.map((d) => d.DRB)),
  }));

  // Sort and filter the top 15 players
  const sortedData = [...totalStatsData]
    .sort((a, b) => {
      if (filteredValue)
        return b[filteredValue] - a[filteredValue];
      return b.totalStats - a.totalStats;
    })
    .slice(0, 15); // Keep only the top 15 players

  svg.call(stackedBarChart, {
    data: sortedData,
    width,
    height,
    xValue: (d) => d.Player,
    yValues: ['STL', 'BLK', 'DRB'],
    xAxisLabel: 'Player',
    yAxisLabel: 'Defensive Stats',
    colorLegendLabel: 'Stats Type',
    setHoveredValue,
    hoveredValue,
    filteredValue, // Pass filteredValue to stackedBarChart
    margin: { top: 10, right: 10, bottom: 100, left: 50 },
    colorLegendX: width - 150,
    colorLegendY: 50,
  });

  svg.call(colorLegend, {
    colorScale: scaleOrdinal()
      .domain(['STL', 'BLK', 'DRB'])
      .range(['#1f77b4', '#ff7f0e', '#2ca02c']),
    colorLegendLabel: 'Stats Type',
    colorLegendX: width - 150,
    colorLegendY: 50,
    setHoveredValue,
    hoveredValue,
    setFilteredValue, // Pass setFilteredValue to colorLegend
  });
};
