import * as d3 from "d3";
import { Component, createRef } from "react";
import { dataSourceLine, rangeX } from "./mock";

class RightContent extends Component {
  constructor(props) {
    super(props);
    this.chartRef = createRef();
    this.axisAreaRef = createRef();
    this.axisScroll = createRef();
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
      this.axisCtx.moveTo(xScale(d), rightConfig.paddingY);
      this.axisCtx.lineTo(xScale(d), rightConfig.paddingY + tickSize);
    });
    this.axisCtx.stroke();
    this.axisCtx.beginPath();
    this.axisCtx.moveTo(startX, rightConfig.paddingY + tickSize);
    this.axisCtx.lineTo(startX, rightConfig.paddingY);
    this.axisCtx.lineTo(endX, rightConfig.paddingY);
    this.axisCtx.lineTo(endX, rightConfig.paddingY + tickSize);
    this.axisCtx.stroke();

    this.axisCtx.textAlign = "center";
    this.axisCtx.textBaseline = "top";
    this.axisCtx.fillStyle = "black";
    // this.axisCtx.rotate(-Math.PI / 2);
    xTicks.forEach((d) => {
      this.axisCtx.beginPath();

      this.axisCtx.fillText(
        xTickFormat(d),
        xScale(d),
        rightConfig.paddingY - 3 * tickSize
      );
      this.axisCtx.closePath();
    });

    this.axisCtx.closePath();
  };

  drawLineData = () => {
    const { xScale, yScale } = this.props;
    this.ctx.fillStyle = "black";
    dataSourceLine.forEach((line) => {
      const lineCtx = d3
        .line()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y))
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
        xScale(firtLine.range[0].x - 5),
        yScale(firtLine.range[0].y - 10)
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
          xScale((linePart.range[1].x + linePart.range[0].x) / 2),
          yScale(linePart.range[0].y)
        );
        this.ctx.closePath();
      });
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
        return yScale(d.y);
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
  drawContent = () => {
    // this.drawXaxis();
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
    this.svg = d3.select(this.axisAreaRef.current);
    // var axisComponent = d3.select(this.axisAreaRef.current);
    // var axis = axisComponent
    //   .append("canvas")
    //   .style("tranform", "rotateX(180deg)")
    //   .attr("width", rightConfig.width)
    //   .attr("height", 40);
    // this.axisCtx = axis.node().getContext("2d");
  }
  renderBrush = () => {
    var brush = d3
      .brushX()
      .extent([
        [0, 0],
        [this.axisScroll.current.offsetWidth, 40],
      ])
      .on("brush end", () => {});
    this.svg
      .append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, rangeX);
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
            // transform: "rotateX(180deg)",
            background: "white",
            // width: "calc(100% - 300px)",
            overflowX: "auto",
          }}
          ref={this.axisScroll}
          // onScroll={(e) => {
          //   // console.log(e.target.scrollLeft);
          //   // console.log(this.chartRef.current.scrollLeft);
          //   this.chartRef.current.scrollLeft = e.target.scrollLeft;
          // }}
        >
          <svg width="100%" height="40" ref={this.axisAreaRef}></svg>
          {/* <div
            ref={this.axisAreaRef}
            style={{ transform: "rotateX(180deg)", width: "100%" }}></div> */}
        </div>
        <div
          style={{
            // width: "calc(100% - 300px)",
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
