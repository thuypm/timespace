import React, { Component, createRef } from "react";
import * as d3 from "d3";
import { dataSourceIntersection, dataSourceLine, rangeX, rangeY } from "./mock";
let startX;
let scrollLeft;
let isDown = false;
class HistoricTimeSpace extends Component {
  constructor(props) {
    super(props);
    this.chartRef = createRef();
    this.areaRef = createRef();
    this.ctx = null;
    this.xScale = null;
    this.yScale = null;
    this.graphicConfig = {
      width: 1920,
      paddingX: 64,
      paddingY: 32,
      height: 800,
    };
    this.leftContentConfig = {
      width: 300,
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
  drawLineData = () => {
    this.ctx.fillStyle = "black";
    dataSourceLine.forEach((line) => {
      const lineCtx = d3
        .line()
        .x((d) => this.xScale(d.x))
        .y((d) => this.yScale(d.y))
        .context(this.ctx);
      //draw first line infomation
      this.ctx.beginPath();
      const firtLine = line[0];
      lineCtx([
        { x: 0, y: firtLine.range[0].y - 5 },
        { x: firtLine.range[0].x, y: firtLine.range[0].y - 5 },
      ]);
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = "black";
      this.ctx.stroke();
      this.ctx.textAlign = "right";
      this.ctx.textBaseline = "top";
      this.ctx.fillText(
        "OffsetTime:" + (firtLine.range[1].x - firtLine.range[0].x),
        this.xScale(firtLine.range[0].x - 5),
        this.yScale(firtLine.range[0].y - 10)
      );
      this.ctx.closePath();

      //draw all line
      line.forEach((linePart) => {
        this.ctx.beginPath();
        lineCtx(linePart.range);
        this.ctx.lineWidth = 20;
        this.ctx.strokeStyle = linePart.color;
        this.ctx.stroke();
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = "black";
        this.ctx.fillText(
          linePart.range[1].x - linePart.range[0].x,
          this.xScale((linePart.range[1].x + linePart.range[0].x) / 2),
          this.yScale(linePart.range[0].y)
        );
        this.ctx.closePath();
      });
    });
  };
  drawIntersectionInfo = () => {
    dataSourceIntersection.forEach((int) => {
      this.ctx.beginPath();
      this.ctx.textAlign = "center";
      this.ctx.font = "20px Arial";
      this.ctx.textBaseline = "top";
      this.ctx.fillText(
        int.name,
        this.leftContentConfig.width / 2,
        this.yScale(int.distance)
      );
      this.ctx.font = "12px Arial";
      this.ctx.fillText(
        "Distance:" + int.distance,
        this.leftContentConfig.width / 2,
        this.yScale(int.distance) + 20
      );
      this.ctx.fillText(
        "Offset:" + int.offset,
        this.leftContentConfig.width / 2,
        this.yScale(int.distance) + 40
      );
      this.ctx.fillText(
        "Cycle:" + int.cycle,
        this.leftContentConfig.width / 2,
        this.yScale(int.distance) + 60
      );
      this.ctx.closePath();
    });
  };
  drawTimeSpaceLine = () => {
    var area = d3
      .area()
      .x0((d) => {
        return this.xScale(d.x1);
      })
      .x1((d) => {
        return this.xScale(d.x2);
      })
      .y((d) => {
        return this.yScale(d.y);
      }) //<-- y1
      .context(this.ctx);
    this.ctx.beginPath();
    area([
      {
        x1: 40,
        x2: 80,
        y: 20,
      },
      {
        x1: 100,
        x2: 200,
        y: 80,
      },
    ]);
    this.ctx.fillStyle = "#D1E9FF";
    this.ctx.fill();
    this.ctx.closePath();
  };
  handleMouseMove = () => {
    var mouseX = d3.event.layerX || d3.event.offsetX;
    var mouseY = d3.event.layerY || d3.event.offsety;
    d3.event.preventDefault();
    if (isDown) {
      const x = d3.event.pageX - this.areaRef.current.offsetLeft;
      const walk = (x - startX) * 3; //scroll-fast
      console.log(walk);
      this.areaRef.current.scrollLeft = scrollLeft - walk;
    }

    this.hoverCtx.clearRect(
      0,
      0,
      this.graphicConfig.width,
      this.graphicConfig.height
    );
    const lineCtx = d3
      .line()
      .x((d) => d.x)
      .y((d) => d.y)
      .context(this.hoverCtx);
    this.hoverCtx.beginPath();
    lineCtx([
      {
        x: mouseX,
        y: 0,
      },
      {
        x: mouseX,
        y: this.graphicConfig.height,
      },
    ]);
    lineCtx([
      {
        x: 0,
        y: mouseY,
      },
      {
        x: this.graphicConfig.width,
        y: mouseY,
      },
    ]);
    this.hoverCtx.lineWidth = 1;
    this.hoverCtx.strokeStyle = "black";
    this.hoverCtx.stroke();
    this.hoverCtx.closePath();
  };
  handleDrag = () => {
    isDown = true;
    startX = d3.event.pageX - this.areaRef.current.offsetLeft;
    scrollLeft = this.areaRef.current.scrollLeft;
  };
  componentDidMount() {
    var base = d3.select(this.chartRef.current);
    // this.graphicConfig.width = this.chartRef.current.offsetWidth - 64;
    // this.graphicConfig.height = this.chartRef.current.offsetHeight - 32;
    var chart = base
      .append("canvas")
      .attr("width", this.graphicConfig.width)
      .attr("height", this.graphicConfig.height);
    this.ctx = chart.node().getContext("2d");
    let hiddenCanvas = base
      .append("canvas")
      .classed("hiddenCanvas", true)
      .attr("width", this.graphicConfig.width)
      .attr("height", this.graphicConfig.height);

    this.drawXaxis(rangeX);
    this.drawYaxis(rangeY);
    this.drawTimeSpaceLine();
    this.drawLineData();
    this.drawIntersectionInfo();
    this.hoverCtx = hiddenCanvas.node().getContext("2d");
    d3.select(hiddenCanvas.node()).on("mousemove", this.handleMouseMove);
    d3.select(hiddenCanvas.node()).on("mouseleave", () => {
      isDown = false;
    });
    d3.select(hiddenCanvas.node()).on("mousedown", this.handleDrag);
    d3.select(hiddenCanvas.node()).on("mouseup", () => {
      isDown = false;
    });
  }
  render() {
    return (
      <div ref={this.areaRef} className="chart-containter">
        <div ref={this.chartRef}></div>
      </div>
    );
  }
}

export default HistoricTimeSpace;
