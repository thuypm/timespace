import * as d3 from "d3";
import { Component, createRef } from "react";
import { dataSourceIntersection } from "./mock";

class LeftContent extends Component {
  constructor(props) {
    super(props);
    this.chartRef = createRef();
    this.areaRef = createRef();
    this.ctx = null;
  }

  drawYaxis = (data) => {
    const { yScale, config } = this.props;

    const [startY, endY] = [config.paddingY, config.height];

    const tickPadding = 3,
      tickSize = 6,
      yTicks = yScale.ticks(),
      yTickFormat = yScale.tickFormat();

    this.ctx.strokeStyle = "black";
    this.ctx.beginPath();
    yTicks.forEach((d) => {
      this.ctx.moveTo(config.width, yScale(d));
      this.ctx.lineTo(config.width - tickSize, yScale(d));
    });
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(config.width - tickSize, startY);
    this.ctx.lineTo(config.width, startY);
    this.ctx.lineTo(config.width, endY);
    this.ctx.lineTo(config.width - tickSize, endY);
    this.ctx.stroke();

    this.ctx.textAlign = "right";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = "black";
    yTicks.forEach((d) => {
      this.ctx.beginPath();
      this.ctx.fillText(
        yTickFormat(d),
        config.width - tickSize - tickPadding,
        yScale(d)
      );
    });
  };

  drawIntersectionInfo = () => {
    const { config, yScale } = this.props;
    dataSourceIntersection.forEach((int) => {
      this.ctx.beginPath();
      this.ctx.textAlign = "center";
      this.ctx.font = "20px Arial";
      this.ctx.textBaseline = "top";
      this.ctx.fillText(int.name, config.width / 2, yScale(int.distance));
      this.ctx.font = "12px Arial";
      this.ctx.fillText(
        "Distance:" + int.distance,
        config.width / 2,
        yScale(int.distance) + 20
      );
      this.ctx.fillText(
        "Offset:" + int.offset,
        config.width / 2,
        yScale(int.distance) + 40
      );
      this.ctx.fillText(
        "Cycle:" + int.cycle,
        config.width / 2,
        yScale(int.distance) + 60
      );
      this.ctx.closePath();
    });
  };

  drawContent = () => {
    this.drawYaxis();
    this.drawIntersectionInfo();
  };
  componentDidMount() {
    const { config } = this.props;
    var base = d3.select(this.chartRef.current);
    // this.graphicConfig.width = this.chartRef.current.offsetWidth - 64;
    // this.graphicConfig.height = this.chartRef.current.offsetHeight - 32;
    var chart = base
      .append("canvas")
      .attr("width", config.width)
      .attr("height", config.height);
    this.ctx = chart.node().getContext("2d");
  }
  render() {
    const { config } = this.props;
    return (
      <div
        ref={this.chartRef}
        style={{
          width: config.width,
          height: config.height,
        }}></div>
    );
  }
}

export default LeftContent;