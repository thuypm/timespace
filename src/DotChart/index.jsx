import * as d3 from "d3";
import { Component, createRef } from "react";
import LeftContent from "./LeftContent";
import { dataScatter, rangeX, rangeY } from "./mock";
import RightContent from "./RightContent";
import React from "react";

let startX;
let scrollLeft;
let startY;
let scrollTop;
let isDown = false;
class DotChart extends Component {
  constructor(props) {
    super(props);
    this.parentRef = createRef();
    this.areaRef = createRef();
    this.leftRef = createRef();
    this.rightRef = createRef();
    this.ctx = null;
    this.xScale = null;
    this.yScale = null;
    this.rightContentConfig = {
      width: 6000,
      paddingX: 64,
      paddingY: 32,
      height: 800,
    };
    this.leftContentConfig = {
      width: 300,
      height: 800,
      paddingX: 64,
      paddingY: 51,
    };
    this.currentViewConfig = {
      width: 300,
      height: 800,
      paddingX: 64,
      paddingY: 51,
    };
    this.getInitialAxis();
  }

  getInitialAxis = () => {
    this.xScale = d3
      .scaleLinear()
      .range([
        0,
        this.leftContentConfig.width + this.rightContentConfig.width - 20,
      ])
      .domain(d3.extent(rangeX));
    this.yScale = d3
      .scaleLinear()
      .range([0, this.leftContentConfig.height])
      .domain(d3.extent(rangeY));
  };

  handleMouseMove = () => {
    var mouseX = d3.event.layerX || d3.event.offsetX;
    var mouseY = d3.event.layerY || d3.event.offsetY;
    if (isDown) {
      const scrollXEl = this.rightRef.current.axisAreaRef.current;
      const x = d3.event.pageX - scrollXEl.offsetLeft;
      const walkX = x - startX; //scroll-fast
      this.rightRef.current.handleBrushZoom(
        walkX / (scrollXEl.scrollWidth - scrollXEl.clientWidth)
      );
      const y = d3.event.pageY - this.parentRef.current.offsetTop;
      const walkY = y - startY; //scroll-fast
      if (
        scrollTop - walkY >= 0 &&
        scrollTop - walkY <= this.parentRef.current.scrollHeight
      )
        this.parentRef.current.scrollTop = scrollTop - walkY;
    }

    this.hoverCtx.clearRect(
      0,
      0,
      this.currentViewConfig.width,
      this.currentViewConfig.height
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
        y: this.currentViewConfig.height,
      },
    ]);
    lineCtx([
      {
        x: 0,
        y: mouseY,
      },
      {
        x: this.currentViewConfig.width,
        y: mouseY,
      },
    ]);
    this.hoverCtx.lineWidth = 1;
    this.hoverCtx.strokeStyle = "black";
    this.hoverCtx.stroke();
    this.hoverCtx.closePath();

    //hightlight point
    // const coordX = this.xScale.invert(mouseX - this.leftContentConfig.width);
    // const coordY = this.yScale.invert(
    //   mouseY - this.rightContentConfig.paddingY
    // );
    const realXCoord = mouseX - this.leftContentConfig.width;
    const listHightLight = dataScatter.filter((point) => {
      // console.log(this.xScale(point.x), )
      return (
        this.xScale(point.x) <= realXCoord + 4 &&
        this.xScale(point.x) >= realXCoord - 4
      );
    });
    // console.log(listHightLight);

    this.hoverCtx.beginPath();
    this.hoverCtx.fillStyle = "white";
    this.hoverCtx.fillRect(mouseX + 10, mouseY - 100, 160, 200);
    this.hoverCtx.closePath();

    let h = 5;
    listHightLight?.forEach((point) => {
      this.hoverCtx.font = "16px Arial";
      this.hoverCtx.fillStyle = "black";
      // start a new path for drawing
      this.hoverCtx.beginPath();
      // paint an arc based on information from the DOM node
      this.hoverCtx.fillText(
        `Point: ${point.x}, ${point.y}`,
        mouseX + 15,
        mouseY - 80 + h
      );
      h += 24;
      this.hoverCtx.closePath();

      this.hoverCtx.fillStyle = "green";
      this.hoverCtx.beginPath();
      this.hoverCtx.arc(
        this.xScale(point.x) + this.leftContentConfig.width,
        this.yScale(point.y),
        8,
        0,
        2 * Math.PI
      );

      // fill the point
      this.hoverCtx.fill();
      this.hoverCtx.closePath();
    });

    // this.rightRef.current.handleMouseMove(mouseX, mouseY);
  };
  handleMouseOut = () => {
    isDown = false;
    this.hoverCtx.clearRect(
      0,
      0,
      this.currentViewConfig.width,
      this.currentViewConfig.height
    );
  };
  handleDrag = () => {
    isDown = true;
    const scrollXEl = this.rightRef.current.axisAreaRef.current;
    startX = d3.event.pageX - scrollXEl.offsetLeft;
    scrollLeft = scrollXEl.scrollLeft;

    startY = d3.event.pageY - this.parentRef.current.offsetTop;
    scrollTop = this.parentRef.current.scrollTop;
  };
  componentDidMount() {
    var base = d3.select(this.areaRef.current);
    this.currentViewConfig.width = this.areaRef.current.offsetWidth;
    let hiddenCanvas = base
      .append("canvas")
      .classed("hiddenCanvas", true)
      .attr("width", this.currentViewConfig.width)
      .attr("height", this.currentViewConfig.height);
    this.leftRef.current?.drawContent();
    this.rightRef.current?.drawContent();
    this.hoverCtx = hiddenCanvas.node().getContext("2d");
    d3.select(hiddenCanvas.node()).on("mousemove", this.handleMouseMove);
    d3.select(hiddenCanvas.node()).on("mouseleave", this.handleMouseOut);
    d3.select(hiddenCanvas.node()).on("mousedown", this.handleDrag);
    d3.select(hiddenCanvas.node()).on("mouseup", () => {
      isDown = false;
    });
  }
  render() {
    return (
      <div
        ref={this.parentRef}
        className="chart-containter"
        style={{ height: "95vh" }}>
        <div ref={this.areaRef} className="hiddenContent"></div>
        <LeftContent
          ref={this.leftRef}
          config={this.leftContentConfig}
          xScale={this.xScale}
          yScale={this.yScale}
        />
        <RightContent
          ref={this.rightRef}
          leftConfig={this.leftContentConfig}
          rightConfig={this.rightContentConfig}
          yScale={this.yScale}
          xScale={this.xScale}
        />
      </div>
    );
  }
}

export default DotChart;
