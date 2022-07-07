import * as d3 from "d3";
import { Component, createRef } from "react";
import LeftContent from "./LeftContent";
import { rangeX, rangeY } from "./mock";
import RightContent from "./RightContent";
let startX;
let scrollLeft;
let isDown = false;
class Chart extends Component {
  constructor(props) {
    super(props);
    this.chartRef = createRef();
    this.areaRef = createRef();
    this.leftRef = createRef();
    this.rightRef = createRef();
    this.ctx = null;
    this.xScale = null;
    this.yScale = null;
    this.rightContentConfig = {
      width: 1920,
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
    this.state = {
      ctx: null,
      //   xScale: null,
      //   yScale: null,
      //   graphicConfig: {
      //     width: 1920,
      //     paddingX: 64,
      //     paddingY: 32,
      //     height: 800,
      //   },
      //   leftContentConfig: {
      //     width: 300,
      //     paddingX: 16,
      //     paddingY: 16,
      //   },
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
      .range([
        this.leftContentConfig.paddingY,
        this.leftContentConfig.height - 20,
      ])
      .domain(d3.extent(rangeY));
  };

  handleMouseMove = () => {
    var mouseX = d3.event.layerX || d3.event.offsetX;
    var mouseY = d3.event.layerY || d3.event.offsety;
    d3.event.preventDefault();
    if (isDown) {
      const x = d3.event.pageX - this.areaRef.current.offsetLeft;
      const walk = x - startX; //scroll-fast
      if (
        scrollLeft - walk >= 0 &&
        scrollLeft - walk <= this.areaRef.current.scrollWidth
      )
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
    // var chart = base
    //   .append("canvas")
    //   .attr("width", this.graphicConfig.width)
    //   .attr("height", this.graphicConfig.height);
    // this.setState({
    //   ctx: chart.node().getContext("2d"),
    // });
    // let hiddenCanvas = base
    //   .append("canvas")
    //   .classed("hiddenCanvas", true)
    //   .attr(
    //     "width",
    //     this.leftContentConfig.width + this.rightContentConfig.width
    //   )
    //   .attr("height", this.leftContentConfig.height);
    this.leftRef.current?.drawContent();
    this.rightRef.current?.drawContent();
    // this.drawXaxis(rangeX);
    // this.drawYaxis(rangeY);
    // this.drawTimeSpaceLine();
    // this.drawLineData();
    // this.drawIntersectionInfo();
    // this.hoverCtx = hiddenCanvas.node().getContext("2d");
    // d3.select(hiddenCanvas.node()).on("mousemove", this.handleMouseMove);
    // d3.select(hiddenCanvas.node()).on("mouseleave", () => {
    //   isDown = false;
    // });
    // d3.select(hiddenCanvas.node()).on("mousedown", this.handleDrag);
    // d3.select(hiddenCanvas.node()).on("mouseup", () => {
    //   isDown = false;
    // });
  }
  render() {
    return (
      <div ref={this.areaRef} className="chart-containter">
        {/* <div
          ref={this.chartRef}
          style={{
            position: "sticky",
            top: 0,
            left: 300,
          }}>
          fffffffffffff
        </div> */}
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

export default Chart;
