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
      colorLegendLabel,
      setHoveredValue,
      hoveredValue,
      margin,
      colorLegendX,
      colorLegendY,
    } = props;
  
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
  
    const xScale = scaleBand()
      .domain(data.map(xValue))
      .range([0, innerWidth])
      .padding(0.2);
  
    const yScale = scaleLinear()
      .domain([0, d3.max(data, (d) => d.STL + d.BLK + d.DRB)]) // Adjusted for stacked total
      .nice()
      .range([innerHeight, 0]);
  
    const colorScale = scaleOrdinal()
      .domain(yValues)
      .range(['#1f77b4', '#ff7f0e', '#2ca02c']); // Colors for STL, BLK, DRB
  
    const g = selection
      .selectAll('.container')
      .data([null])
      .join('g')
      .attr('class', 'container')
      .attr(
        'transform',
        `translate(${margin.left},${margin.top})`,
      );
  
    // Stack generator for stacking the three stats
    const stackedData = stack().keys(yValues)(data);
  
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
      .on('mouseover', (event, d) => setHoveredValue(d))
      .on('mouseout', () => setHoveredValue(null));
  
    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(axisBottom(xScale))
      .selectAll('text')
      .attr('y', 0)
      .attr('x', -9)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(-60)')
      .style('text-anchor', 'end');
  
    // Y Axis
    g.append('g').call(axisLeft(yScale));
  
    // X Axis Label
    g.append('text')
      .attr('class', 'axis-label')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .text(xAxisLabel);
  
    // Y Axis Label
    g.append('text')
      .attr('class', 'axis-label')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text(yAxisLabel);
  
    // Legend
    const legend = g
      .append('g')
      .attr(
        'transform',
        `translate(${colorLegendX}, ${colorLegendY})`,
      );
  
    legend
      .selectAll('rect')
      .data(yValues)
      .join('rect')
      .attr('x', 0)
      .attr('y', (d, i) => i * 20)
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', (d) => colorScale(d));
  
    legend
      .selectAll('text')
      .data(yValues)
      .join('text')
      .attr('x', 24)
      .attr('y', (d, i) => i * 20 + 9)
      .attr('dy', '0.35em')
      .text((d) => d);
  };
  