import React, { Component, createRef } from "react";
import * as d3 from "d3";
import { rangeX, rangeY } from "./mock";

class HistoricTimeSpace extends Component {
  constructor(props) {
    super(props);
    this.chartRef = createRef();
    this.ctx = null;
    this.xScale = null;
    this.yScale = null;
    this.graphicConfig = {
      width: 900,
      paddingX: 64,
      paddingY: 32,
      height: 800,
    };
    this.leftContentConfig = {
      width: 480,
      paddingX: 16,
      paddingY: 16,
    };
  }

  drawXaxis = (data) => {
    this.xScale = d3
      .scaleLinear()
      .range([this.leftContentConfig.width, this.graphicConfig.width - 20])
      .domain(d3.extent(data));

    const [startX, endX] = [
      this.leftContentConfig.width,
      this.graphicConfig.width,
    ];
    let tickSize = 6,
      xTicks = this.xScale.ticks(), // You may choose tick counts. ex: this.xScale.ticks(20)
      xTickFormat = this.xScale.tickFormat(); // you may choose the format. ex: this.xScale.tickFormat(tickCount, ".0s")
    this.ctx.strokeStyle = "black";
    this.ctx.beginPath();
    xTicks.forEach((d) => {
      this.ctx.moveTo(this.xScale(d), this.graphicConfig.paddingY);
      this.ctx.lineTo(this.xScale(d), this.graphicConfig.paddingY + tickSize);
    });
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(startX, this.graphicConfig.paddingY + tickSize);
    this.ctx.lineTo(startX, this.graphicConfig.paddingY);
    this.ctx.lineTo(endX, this.graphicConfig.paddingY);
    this.ctx.lineTo(endX, this.graphicConfig.paddingY + tickSize);
    this.ctx.stroke();

    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "top";
    this.ctx.fillStyle = "black";
    xTicks.forEach((d) => {
      this.ctx.beginPath();
      this.ctx.fillText(
        xTickFormat(d),
        this.xScale(d),
        this.graphicConfig.paddingY - 3 * tickSize
      );
    });
  };

  drawYaxis = (data) => {
    this.yScale = d3
      .scaleLinear()
      .range([this.graphicConfig.paddingY, this.graphicConfig.height - 20])
      .domain(d3.extent(data));

    const [startY, endY] = [
      this.graphicConfig.paddingY,
      this.graphicConfig.height,
    ];

    const tickPadding = 3,
      tickSize = 6,
      yTicks = this.yScale.ticks(),
      yTickFormat = this.yScale.tickFormat();

    this.ctx.strokeStyle = "black";
    this.ctx.beginPath();
    yTicks.forEach((d) => {
      this.ctx.moveTo(this.leftContentConfig.width, this.yScale(d));
      this.ctx.lineTo(this.leftContentConfig.width - tickSize, this.yScale(d));
    });
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.leftContentConfig.width - tickSize, startY);
    this.ctx.lineTo(this.leftContentConfig.width, startY);
    this.ctx.lineTo(this.leftContentConfig.width, endY);
    this.ctx.lineTo(this.leftContentConfig.width - tickSize, endY);
    this.ctx.stroke();

    this.ctx.textAlign = "right";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = "black";
    yTicks.forEach((d) => {
      this.ctx.beginPath();
      this.ctx.fillText(
        yTickFormat(d),
        this.leftContentConfig.width - tickSize - tickPadding,
        this.yScale(d)
      );
    });
  };
  componentDidMount() {
    var base = d3.select(this.chartRef.current);
    this.graphicConfig.width = this.chartRef.current.offsetWidth - 64;
    this.graphicConfig.height = this.chartRef.current.offsetHeight - 32;
    var chart = base
      .append("canvas")
      .attr("width", this.graphicConfig.width)
      .attr("height", this.graphicConfig.height);
    this.ctx = chart.node().getContext("2d");
    this.drawXaxis(rangeX);
    this.drawYaxis(rangeY);
  }
  render() {
    return <div ref={this.chartRef} className="w-full h-full"></div>;
  }
}

export default HistoricTimeSpace;
