import * as d3 from "d3";
import { Component, createRef } from "react";
import { dataScatter, dataSourceLine, rangeX } from "./mock";
import React from "react";

class RightContent extends Component {
  constructor(props) {
    super(props);
    this.chartRef = createRef();
    this.brushRef = createRef();
    this.axisScroll = createRef();
    this.axisAreaRef = createRef();
  }

  drawXaxis = () => {
    const { rightConfig, xScale } = this.props;
    const [startX, endX] = [0, rightConfig.width];
    let tickSize = 6,
      xTicks = xScale.ticks(), // You may choose tick counts. ex: xScale.ticks(20)
      xTickFormat = xScale.tickFormat(); // you may choose the format. ex: xScale.tickFormat(tickCount, ".0s")
    this.axisCtx.strokeStyle = "black";
    this.axisCtx.beginPath();
    xTicks.forEach((d) => {
      this.axisCtx.moveTo(xScale(d), 15);
      this.axisCtx.lineTo(xScale(d), 15 + tickSize);
    });
    this.axisCtx.stroke();
    this.axisCtx.beginPath();
    this.axisCtx.moveTo(startX, 15 + tickSize);
    this.axisCtx.lineTo(startX, 15);
    this.axisCtx.lineTo(endX, 15);
    this.axisCtx.lineTo(endX, 15 + tickSize);
    this.axisCtx.stroke();

    this.axisCtx.textAlign = "center";
    this.axisCtx.textBaseline = "top";
    this.axisCtx.fillStyle = "black";
    // this.axisCtx.rotate(-Math.PI / 2);
    xTicks.forEach((d) => {
      this.axisCtx.beginPath();
      if (d)
        this.axisCtx.fillText(xTickFormat(d), xScale(d), 18 - 3 * tickSize);
      else
        this.axisCtx.fillText(
          xTickFormat(d),
          xScale(d + 0.5),
          18 - 3 * tickSize
        );
      this.axisCtx.closePath();
    });

    this.axisCtx.closePath();
  };

  drawScatter = (y) => {
    const { xScale, yScale } = this.props;
    const upperLineCtx = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y) - 40)
      .context(this.ctx);
    const downlineCtx = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y) + 20)
      .context(this.ctx);
    this.ctx.beginPath();
    upperLineCtx([
      { x: 0, y },
      { x: rangeX[1], y },
    ]);
    downlineCtx([
      { x: 0, y },
      { x: rangeX[1], y },
    ]);
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();
    this.ctx.closePath();

    dataScatter.forEach((point) => {
      this.ctx.fillStyle = "green";

      // start a new path for drawing
      this.ctx.beginPath();

      // paint an arc based on information from the DOM node
      this.ctx.arc(xScale(point.x), yScale(point.y) + 20, 4, 0, 2 * Math.PI);
      this.ctx.arc(xScale(point.x), yScale(point.y) - 40, 4, 0, 2 * Math.PI);

      // fill the point
      this.ctx.fill();
      this.ctx.closePath();
    });
  };
  drawLineData = () => {
    const { xScale, yScale } = this.props;
    this.ctx.fillStyle = "black";
    dataSourceLine.forEach((line) => {
      const lineCtx = d3
        .line()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y) - 22)
        .context(this.ctx);

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
          xScale((linePart.range[1].x + linePart.range[0].x) / 2),
          yScale(linePart.range[0].y) - 22
        );
        this.ctx.closePath();
      });
    });
    dataSourceLine.forEach((line) => {
      const lineCtx = d3
        .line()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y) + 2)
        .context(this.ctx);
      //draw first line infomation

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
          xScale((linePart.range[1].x + linePart.range[0].x) / 2),
          yScale(linePart.range[0].y) + 2
        );
        this.ctx.closePath();
      });
      this.drawScatter(line[0].range[0].y);
    });
  };

  drawTimeSpaceLine = () => {
    const { xScale, yScale } = this.props;

    var area = d3
      .area()
      .x0((d) => {
        return xScale(d.x1);
      })
      .x1((d) => {
        return xScale(d.x2);
      })
      .y((d) => {
        return yScale(d.y) - 10;
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
    this.ctx.fillStyle = "#acd6ff80";
    this.ctx.fill();

    this.ctx.closePath();
    this.ctx.beginPath();

    area([
      {
        x1: 200,
        x2: 300,
        y: 20,
      },
      {
        x1: 150,
        x2: 220,
        y: 80,
      },
    ]);
    this.ctx.fillStyle = "#c0c0c080";
    this.ctx.fill();
    this.ctx.closePath();
  };
  drawContent = () => {
    this.drawXaxis();
    this.drawTimeSpaceLine();
    this.drawLineData();
    this.renderBrush();
  };
  componentDidMount() {
    const { rightConfig } = this.props;
    var base = d3.select(this.chartRef.current);
    var chart = base
      .append("canvas")
      .attr("width", rightConfig.width)
      .attr("height", rightConfig.height);
    this.ctx = chart.node().getContext("2d");
    this.ctx.imageSmoothingQuality = "high";
    this.svg = d3.select(this.brushRef.current);
    var axisComponent = d3.select(this.axisAreaRef.current);
    var axis = axisComponent
      .append("canvas")
      .attr("width", rightConfig.width)
      .attr("height", 20);
    this.axisCtx = axis.node().getContext("2d");
  }
  renderBrush = () => {
    this.currentBrushRange = [0, 0];
    this.brushObject = d3
      .brushX()
      .extent([
        [0, 0],
        [this.axisScroll.current.offsetWidth, 10],
      ])
      .on("brush end", () => {
        const ratio =
          d3.event.selection[0] /
          (this.axisScroll.current.offsetWidth +
            d3.event.selection[0] -
            d3.event.selection[1]);
        this.axisAreaRef.current.scrollLeft =
          ratio *
          (this.axisAreaRef.current.scrollWidth -
            this.axisAreaRef.current.clientWidth);
        this.chartRef.current.scrollLeft =
          ratio *
          (this.chartRef.current.scrollWidth -
            this.chartRef.current.clientWidth);
      });
    this.brush = this.svg
      .append("g")
      .attr("class", "brush")
      .call(this.brushObject)
      .call(this.brushObject.move, rangeX);
  };
  handleBrushZoom = (walk) => {
    const currentBrushRange = [
      Number(this.brush.select(".selection").attr("x")),
      Number(this.brush.select(".selection").attr("x")) +
        Number(this.brush.select(".selection").attr("width")),
    ];
    const change = (walk * this.axisScroll.current.offsetWidth) / 50;
    if (
      currentBrushRange[0] - change >= 0 &&
      currentBrushRange[0] - change <=
        this.axisScroll.current.offsetWidth -
          Number(this.brush.select(".selection").attr("width"))
    ) {
      this.brush.call(this.brushObject.move, [
        currentBrushRange[0] - change,
        currentBrushRange[1] - change,
      ]);
    }
  };
  render() {
    const { rightConfig } = this.props;
    return (
      <div style={{ width: "calc(100% - 300px)" }}>
        <div
          style={{
            position: "sticky",
            height: "min-content",
            top: 0,
            left: 300,
            zIndex: 25,
            background: "white",
          }}
          ref={this.axisScroll}>
          <svg width="100%" height="16" ref={this.brushRef}></svg>
          <div style={{ overflowX: "hidden" }} ref={this.axisAreaRef}></div>
          {/* <div
            ref={this.axisAreaRef}
            style={{ transform: "rotateX(180deg)", width: "100%" }}></div> */}
        </div>
        <div
          style={{
            height: rightConfig.height,
            overflowX: "hidden",
            overflowY: "hidden",
          }}
          ref={this.chartRef}></div>
      </div>
    );
  }
}

export default RightContent;
