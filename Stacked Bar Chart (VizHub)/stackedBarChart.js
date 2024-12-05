import {
  select,
  scaleBand,
  scaleLinear,
  scaleOrdinal,
  axisBottom,
  axisLeft,
  stack,
} from 'd3';

export const stackedBarChart = (selection, props) => {
  const {
    data,
    width,
    height,
    xValue,
    yValues,
    xAxisLabel,
    yAxisLabel,
    setHoveredValue,
    hoveredValue,
    margin,
    filteredValue, // The selected statistic to filter
  } = props;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Use data directly as it's already filtered and sorted in index.js
  const xScale = scaleBand()
    .domain(data.map(xValue))
    .range([0, innerWidth])
    .padding(0.2);

  const yScale = scaleLinear()
    .domain([0, 14]) // Adjust this based on your data's max value
    .nice()
    .range([innerHeight, 0]);

  const colorScale = scaleOrdinal()
    .domain(yValues)
    .range(['#1f77b4', '#ff7f0e', '#2ca02c']);

  const g = selection
    .selectAll('.container')
    .data([null])
    .join('g')
    .attr('class', 'container')
    .attr(
      'transform',
      `translate(${margin.left},${margin.top})`,
    );

  // Remove redundant data filtering
  // const filteredData = filteredValue
  //   ? [...data].sort(
  //       (a, b) => b[filteredValue] - a[filteredValue],
  //     )
  //   : [...data];

  // Use data directly in stackedData
  const stackedData = stack().keys(
    filteredValue ? [filteredValue] : yValues,
  )(data);

  // Create a tooltip element
  const tooltip = select('body')
    .selectAll('.tooltip')
    .data([null])
    .join('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('background-color', 'white')
    .style('border', '1px solid #ccc')
    .style('padding', '5px')
    .style('border-radius', '4px')
    .style('box-shadow', '0 2px 4px rgba(0, 0, 0, 0.2)')
    .style('pointer-events', 'none')
    .style('visibility', 'hidden')
    .style('font-size', '12px');

  // Draw bars
  g.selectAll('g.series')
    .data(stackedData)
    .join('g')
    .attr('class', 'series')
    .attr('fill', (d) => colorScale(d.key))
    .selectAll('rect')
    .data((d) => d)
    .join('rect')
    .attr('x', (d) => xScale(xValue(d.data)))
    .attr('y', (d) => yScale(d[1]))
    .attr('height', (d) => yScale(d[0]) - yScale(d[1]))
    .attr('width', xScale.bandwidth())
    .on('mouseover', (event, d) => {
      setHoveredValue(d);
      tooltip
        .style('visibility', 'visible')
        .html(
          `Value: ${
            filteredValue
              ? d.data[filteredValue]
              : (d[1] - d[0] + 0.01).toFixed(1)
          }`,
        ); // Display the bar value
    })
    .on('mousemove', (event) => {
      tooltip
        .style('top', `${event.pageY - 28}px`)
        .style('left', `${event.pageX + 5}px`);
    })
    .on('mouseout', () => {
      setHoveredValue(null);
      tooltip.style('visibility', 'hidden');
    });

  // Remove existing axes and labels before adding new ones
  g.selectAll('.x-axis').remove();
  g.selectAll('.y-axis').remove();
  g.selectAll('.axis-label').remove();

  // Add X Axis
  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(axisBottom(xScale))
    .selectAll('text')
    .attr('y', 0)
    .attr('x', -9)
    .attr('dy', '.35em')
    .attr('transform', 'rotate(-60)') // Angled player names below bars
    .style('text-anchor', 'end');

  // Add Y Axis
  g.append('g')
    .attr('class', 'y-axis')
    .call(axisLeft(yScale));

  // X Axis Label
  g.append('text')
    .attr('class', 'axis-label x-axis-label')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + margin.bottom - 10)
    .attr('text-anchor', 'middle')
    .text(xAxisLabel);

  // Y Axis Label
  g.append('text')
    .attr('class', 'axis-label y-axis-label')
    .attr('x', -innerHeight / 2)
    .attr('y', -margin.left + 15)
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text(yAxisLabel);
};
