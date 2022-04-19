import { Component, ElementRef, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnChanges {
  @Input() public data: { value: number, date: string }[];

  private width = 700;
  private height = 700;
  private margin = 50;

  public svg;
  public svgInner;
  public yScale;
  public xScale;
  public xAxis;
  public yAxis;
  public lineGroup;
  public lineGroup2;
  public lineGroup3;
  public lineGroup4;

  constructor(public chartElem: ElementRef) {
  }

  public ngOnChanges(changes): void {
    if (changes.hasOwnProperty('data') && this.data) {
 
      this.initializeChart();
      this.drawChart();

      window.addEventListener('resize', () => this.drawChart());
    }
  }

  private initializeChart(): void {
    this.svg = d3
      .select(this.chartElem.nativeElement)
      .select('.linechart')
      .append('svg')
      .attr('height', this.height);
    this.svgInner = this.svg
      .append('g')
      .style('transform', 'translate(' + this.margin + 'px, ' + this.margin + 'px)');

    this.yScale = d3
      .scaleLinear()
      .domain([d3.max(this.data, d => d.value) + 1, 0])
      .range([0, this.height - 2 * this.margin]);

    this.yAxis = this.svgInner
      .append('g')
      .attr('id', 'y-axis')
      .style('transform', 'translate(' + this.margin + 'px,  0)');

    this.xScale = d3.scaleTime().domain(d3.extent(this.data, d => new Date(d.date)));

    this.xAxis = this.svgInner
      .append('g')
      .attr('id', 'x-axis')
      .style('transform', 'translate(0, ' + (this.height - 2 * this.margin) + 'px)');

    this.lineGroup = this.svgInner
      .append('g')
      .append('path')
      .attr('id', 'line')
      .style('fill', 'none')
      .style('stroke', 'blue')
      .style('stroke-width', '2px')

    this.lineGroup2 = this.svgInner
      .append('g')
      .append('path')
      .attr('id', 'line')
      .style('fill', 'none')
      .style('stroke', 'red')
      .style('stroke-width', '4px')

      this.lineGroup3 = this.svgInner
      .append('g')
      .append('path')
      .attr('id', 'line')
      .style('fill', 'none')
      .style('stroke', 'purple')
      .style('stroke-width', '4px')

      this.lineGroup4 = this.svgInner
      .append('g')
      .append('path')
      .attr('id', 'line')
      .style('fill', 'none')
      .style('stroke', 'orange')
      .style('stroke-width', '4px')
  }

  private drawChart(): void {
    this.width = this.chartElem.nativeElement.getBoundingClientRect().width;
    this.svg.attr('width', this.width);

    this.xScale.range([this.margin, this.width - 2 * this.margin]);

    const xAxis = d3
      .axisBottom(this.xScale)
      .ticks(this.data.length)
      .tickFormat(d3.timeFormat('%d / %m / %Y'));

    this.xAxis.call(xAxis);

    const yAxis = d3
      .axisLeft(this.yScale);

    this.yAxis.call(yAxis);

    const line = d3
      .line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveMonotoneX);

    const points: [number, number][] = this.data.map(d => [
      this.xScale(new Date(d.date)),
      this.yScale(d.value),
    ]);

    const limitLine: [number, number][] = this.data.map(d => [
      this.xScale(new Date(d.date)),
      this.yScale(1300),
    ]);

    // Calculate all time average
    let sum = 0;
    let weeks = Math.floor(this.data.length / 7);
    console.log('weeks total: ', weeks);
    this.data.forEach((d, i) => {
      if (i < weeks*7) {
        sum += d.value;
      }
    })
    const average = sum/(weeks*7);

    // Calculate average of last week
    let sumLastWeek = 0;
    if (this.data.length - 8 >= 0) {
      let dataLastWeek = this.data.slice(this.data.length - 8, this.data.length - 1);
      dataLastWeek.forEach((d, i) => {
        sumLastWeek += d.value;
      });
    }
    const averageLastWeek = sumLastWeek/7;

    const averageLine: [number, number][] = this.data.map(d => [
      this.xScale(new Date(d.date)),
      this.yScale(average),
    ]);

    const averageLineLastWeek: [number, number][] = this.data.map(d => [
      this.xScale(new Date(d.date)),
      this.yScale(averageLastWeek),
    ]);

    this.lineGroup.attr('d', line(points));
    this.lineGroup2.attr('d', line(limitLine));
    this.lineGroup3.attr('d', line(averageLine));
    this.lineGroup4.attr('d', line(averageLineLastWeek));
  }
}
