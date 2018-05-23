import { Component, OnInit } from '@angular/core';
import { BOX_PLOT_DATA, CURRENT_LINE, MEDIAN_LINE } from './boxplotdata';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  svg;
  width = 1200;
  height = 500;
  barWidth = 20;
  margin = { top: 20, right: 10, bottom: 20, left: 10 };
  totalWidth;
  totalheight;
  yMax;
  yMin;

  constructor() { }

  ngOnInit() {
    this.width = this.width - this.margin.left - this.margin.right;
    this.height = this.height - this.margin.top - this.margin.bottom;
    this.totalWidth = this.width + this.margin.left + this.margin.right;
    this.totalheight = this.height + this.margin.top + this.margin.bottom;

    this.getYMaxMinValue();

    this.drawBoxPlotChart();
    this.drawLineChart();
  }


  getYMaxMinValue = () => {
    const tempArray = [];
    BOX_PLOT_DATA.forEach((obj) => {
      tempArray.push(...obj['whiskers']);
    });

    MEDIAN_LINE.forEach((obj) => {
      tempArray.push(obj['y']);
    });

    CURRENT_LINE.forEach((obj) => {
      tempArray.push(obj['y']);
    });

    this.yMax = d3.max(tempArray);
    this.yMin = d3.min(tempArray);
  }

  drawBoxPlotChart = () => {
    // Prepare the data for the box plots
    const boxPlotData = BOX_PLOT_DATA;

    console.log(Object.keys(BOX_PLOT_DATA));

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(Object.keys(BOX_PLOT_DATA));


    for (let i = 0; i < boxPlotData.length; i++) {
      boxPlotData[i]['color'] = colorScale(i + '');
    }


    const xScale = d3.scalePoint()
      .domain(Object.keys(BOX_PLOT_DATA))
      .rangeRound([0, this.width])
      .padding(1);

    const yScale = d3.scaleLinear()
      .domain([this.yMax, this.yMin])
      .range([0, this.height]);

    // Setup the svg and group we will draw the box plot in
    this.svg = d3.select('#chartDiv').append('svg')
      .attr('width', this.totalWidth)
      .attr('height', this.totalheight)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // Move the left axis over 25 pixels, and the top axis over 465 pixels
    const axisG = this.svg.append('g').attr('transform', 'translate(25,0)');
    const axisTopG = this.svg.append('g').attr('transform', 'translate(35,460)');

    // Setup the group the box plot elements will render in
    const g = this.svg.append('g')
      .attr('transform', 'translate(25,0)');

    // Draw the box plot vertical lines
    const verticalLines = g.selectAll('.verticalLines')
      .data(boxPlotData)
      .enter()
      .append('line')
      .attr('x1', (datum) => {
        return xScale(datum.key) + this.barWidth / 2;
      }
      )
      .attr('y1', (datum) => {
        const whisker = datum.whiskers[0];
        return yScale(whisker);
      }
      )
      .attr('x2', (datum) => {
        return xScale(datum.key) + this.barWidth / 2;
      }
      )
      .attr('y2', (datum) => {
        const whisker = datum.whiskers[1];
        return yScale(whisker);
      }
      )
      // .attr('stroke', '#000')
      .attr('stroke', (datum) => datum.color)
      .attr('stroke-width', 1)
      .attr('fill', 'none');

    const rectToolTipDiv = d3.select('#chartDiv').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute');

    // Draw the boxes of the box plot, filled in white and on top of vertical lines
    const rects = g.selectAll('rect')
      .data(boxPlotData)
      .enter()
      .append('rect')
      .attr('width', this.barWidth)
      .attr('height', function (datum) {
        const quartiles = datum.quartile;
        const height = yScale(quartiles[0]) - yScale(quartiles[2]);
        return height;
      }
      )
      .attr('x', function (datum) {
        return xScale(datum.key);
      }
      )
      .attr('y', function (datum) {
        return yScale(datum.quartile[2]);
      }
      )
      .attr('fill', function (datum) {
        return datum.color;
      }
      )
      .attr('stroke', (datum) => datum.color)
      .attr('stroke-width', 1)
      .on('mouseover', (d) => {
        console.log(d);
        let twentyFivePercent = d['quartile']['0'];
        let FiftyPercent = d['quartile']['1'];
        let seventyFivePercent = d['quartile']['2'];

        twentyFivePercent = Number(twentyFivePercent).toFixed(2);
        FiftyPercent = Number(FiftyPercent).toFixed(2);
        seventyFivePercent = Number(seventyFivePercent).toFixed(2);

        rectToolTipDiv.transition()
          .duration(500)
          .style('display', 'block')
          .style('opacity', .9);
        rectToolTipDiv.html(
          'P75 = ' + seventyFivePercent + ' <br/> ' + 'Avg = ' + FiftyPercent + ' <br/> ' + 'P25 = ' + twentyFivePercent
        )
          .style('padding', 10 + 'px')
          .style('font-weight', 700)
          .style('font-size', '12px')
          .style('font-family', '12px')
          .style('background-color', 'sans-serif')
          .style('border', '1px solid')
          .style('border-radius', '10px')
          .style('left', (d3.event.pageX) + 10 + 'px')
          .style('top', (d3.event.pageY - 28) + 'px');
      })
      .on('mouseout', (d) => {
        rectToolTipDiv.transition()
          .duration(500)
          .style('display', 'none');
      });

    // Now render all the horizontal lines at once - the whiskers and the median
    const horizontalLineConfigs = [
      // Top whisker
      {
        x1: (datum) => xScale(datum.key),
        y1: (datum) => yScale(datum.whiskers[0]),
        x2: (datum) => xScale(datum.key) + this.barWidth,
        y2: (datum) => yScale(datum.whiskers[0])
      },
      // Median line
      {
        x1: (datum) => xScale(datum.key),
        y1: (datum) => yScale(datum.quartile[1]),
        x2: (datum) => xScale(datum.key) + this.barWidth,
        y2: (datum) => yScale(datum.quartile[1])
      },
      // Bottom whisker
      {
        x1: (datum) => xScale(datum.key),
        y1: (datum) => yScale(datum.whiskers[1]),
        x2: (datum) => xScale(datum.key) + this.barWidth,
        y2: (datum) => yScale(datum.whiskers[1])
      }
    ];

    for (let i = 0; i < horizontalLineConfigs.length; i++) {
      const lineConfig = horizontalLineConfigs[i];

      // Draw the whiskers at the min for this series
      let horizontalLine;
      if (i === 1) {
        horizontalLine = g.selectAll('.whiskers')
          .data(boxPlotData)
          .enter()
          .append('line')
          .attr('x1', lineConfig.x1)
          .attr('y1', lineConfig.y1)
          .attr('x2', lineConfig.x2)
          .attr('y2', lineConfig.y2)
          .attr('stroke', '#000')
          .attr('stroke-width', 1)
          .attr('fill', 'none');
      } else {
        horizontalLine = g.selectAll('.whiskers')
          .data(boxPlotData)
          .enter()
          .append('line')
          .attr('x1', lineConfig.x1)
          .attr('y1', lineConfig.y1)
          .attr('x2', lineConfig.x2)
          .attr('y2', lineConfig.y2)
          .attr('stroke', (datum) => datum.color)
          .attr('stroke-width', 1)
          .attr('fill', 'none');
      }
    }

    // Setup a scale on the left
    const yAxis = d3.axisLeft(yScale);
    axisG.append('g')
      .call(yAxis)
      .selectAll('line')
      .attr('x2', () => this.width)
      .attr('stroke', '#e5e5e5')
      .attr('shape-rendering', 'crispEdges')
      .attr('fill', 'none');

    // Setup a series axis on the top
    const xAxis = d3.axisBottom(xScale);
    axisTopG.append('g')
      .call(xAxis)
      .selectAll('line')
      .attr('y2', () => -this.height)
      .attr('stroke', '#e5e5e5')
      .attr('shape-rendering', 'crispEdges')
      .attr('fill', 'none');

    axisTopG.select('path').attr('stroke', '#e5e5e5');
  }


  drawLineChart = () => {

    const x = d3.scaleLinear().rangeRound([0, this.width]);
    const y = d3.scaleLinear().range([0, this.height]);

    const median = MEDIAN_LINE;
    const currentLine = CURRENT_LINE;

    // Define the line
    const valueline = d3.line<ChartData>()
      .x((d: ChartData) => x(d['x']))
      .y((d: ChartData) => y(d['y']));

    const xScale = d3.scalePoint()
      .domain(Object.keys(BOX_PLOT_DATA))
      .rangeRound([0, this.width])
      .padding(1);

    const yScale = d3.scaleLinear()
      .domain([this.yMax, this.yMin]) // input
      .range([0, this.height]); // output


    // // Define the axes
    const xAxis = d3.axisBottom(xScale);

    const plotLine = d3.line()
      .x((d) => {
        return xScale(d['x']);
      })
      .y((d) => {
        return yScale(d['y']);
      });

    for (let i = 0; i < currentLine.length - 1; i++) {

      const currentValue = currentLine[i + 1]['y'];
      const data = [currentLine[i], currentLine[i + 1]];
      const path = this.svg.append('path')
        .data([data])
        .attr('d', plotLine)
        .attr('stroke-width', '2')
        .attr('transform', 'translate(35,0)')
        .attr('fill', 'none');

      const boxPlotObj = BOX_PLOT_DATA[i + 1];

      if (currentValue >= boxPlotObj['quartile'][0] && currentValue <= boxPlotObj['quartile'][2]) {
        path.attr('stroke', 'lawngreen');
      } else if (currentValue >= boxPlotObj['whiskers'][0] && currentValue <= boxPlotObj['whiskers'][1]) {
        path.attr('stroke', 'yellow');
      } else {
        path.attr('stroke', 'red');
      }
    }

    // const medianLineAnimation = d3.transition()
    //   .duration(1000)
    //   .ease(d3.easeLinear);

    this.svg.append('path')
      .data([median])
      .attr('d', plotLine)
      .attr('stroke', 'blue')
      .attr('stroke-width', '2')
      .attr('transform', 'translate(35,0)')
      .attr('fill', 'none');

    const dotToolTip = d3.select('#chartDiv').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute');

    // 12. Appends a circle for each datapoint
    this.svg.selectAll('.dot')
      .data(currentLine)
      .enter().append('circle') // Uses the enter().append() method
      .attr('class', 'dot') // Assign a class for styling
      .attr('cx', (d, i) => xScale(i))
      .attr('cy', (d) => yScale(d.y))
      .attr('transform', 'translate(35,0)')
      .style('fill', 'green')
      .attr('r', 5)
      .on('mouseover', (d) => {
        dotToolTip.transition()
          .duration(500)
          .style('display', 'block')
          .style('opacity', .9);
        dotToolTip.html('(' + d['x'] + ', ' + d['y'] + ')')
          .style('padding', 10 + 'px')
          .style('font-weight', 700)
          .style('font-size', '12px')
          .style('font-family', '12px')
          .style('background-color', 'sans-serif')
          .style('border', '1px solid')
          .style('border-radius', '10px')
          .style('left', (d3.event.pageX) + 10 + 'px')
          .style('top', (d3.event.pageY - 28) + 'px');
      })
      .on('mouseout', (d) => {
        dotToolTip.transition()
          .duration(500)
          .style('display', 'none');
      });
  }
}
interface ChartData {
  x: number;
  y: number;
}
