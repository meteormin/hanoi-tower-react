import React, { Component, KeyboardEvent, DragEvent } from "react";
import { Container as BsContainer, Row, Col, Button } from "react-bootstrap";
import {
  ContainerProps,
  Plate,
  Container as ContainerInterface
} from "../types";
import Column from "./Column";
import { date } from "../helpers";
import moment from "moment";

interface ContainerState {
  module: ContainerInterface;
  selectedColumn: number;
  selectedPlate: Plate | null;
  start: boolean;
  end: boolean;
  startAt: moment.Moment | null;
  time: string;
  timerId: NodeJS.Timer | null;
}

class Container extends Component<ContainerProps, ContainerState> {
  constructor(props: ContainerProps) {
    super(props);
    this.state = {
      module: props.module,
      selectedColumn: 0,
      selectedPlate: null,
      start: false,
      startAt: null,
      end: false,
      time: "00:00:00",
      timerId: null
    };
  }

  componentDidMount() {
    this.setState({
      module: this.props.module,
      selectedColumn: 0,
      selectedPlate: null,
      start: false,
      startAt: null,
      end: false,
      time: "00:00:00",
      timerId: null
    });
  }

  componentDidUpdate(
    _prevProps: Readonly<ContainerProps>,
    prevState: Readonly<ContainerState>,
    _snapshot?: any
  ) {
    if (prevState.module.level != this.props.module.level) {
      this.endTimer();
      this.setState({
        module: this.props.module,
        selectedColumn: 0,
        selectedPlate: null,
        start: false,
        startAt: null,
        end: false,
        time: "00:00:00",
        timerId: null
      });
    }

    if (prevState.selectedPlate != this.state.module.selectedPlate) {
      this.setState({
        selectedPlate: this.state.module.selectedPlate
      });

      if (!this.state.start) {
        this.startTimer();
        this.setState({
          start: true
        });
      }

      if (this.state.module.columns[2]) {
        if (
          this.state.module.columns[2].stack.length == this.state.module.level
        ) {
          this.endTimer();
        }
      }
    }

    if (prevState.selectedColumn != this.state.module.selectedColumn) {
      this.setState({
        selectedColumn: this.state.module.selectedColumn
      });
    }

    if (
      prevState.module.columns[0].stack.length !=
      this.state.module.columns[0].stack.length ||
      prevState.module.columns[1].stack.length !=
      this.state.module.columns[1].stack.length ||
      prevState.module.columns[2].stack.length !=
      this.state.module.columns[2].stack.length
    ) {
      this.setState({
        module: this.state.module
      });
    }
  }

  startTimer = () => {
    const now = date(date.now());
    const timerId = setInterval(() => {
      this.setState({
        time: this.getTimeString()
      });
    }, 1000);

    this.setState({
      startAt: now,
      timerId: timerId
    });
  };

  endTimer = () => {
    if (this.state.timerId) {
      clearInterval(this.state.timerId);
      this.setState({
        timerId: null,
        end: true
      });
    }
  };

  onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    e.preventDefault();
    console.log(e);
    switch (e.code) {
      case "Space":
        if (this.state.module.selectedPlate) {
          this.drop(this.state.module.selectedColumn);
        } else {
          this.up(this.state.module.selectedColumn);
        }
        break;
      case "ArrowRight":
        this.right();
        break;
      case "ArrowLeft":
        this.left();
        break;
    }
  };

  getTimeString = () => {
    const now = date(date.now());
    const time = date
      .duration(now.diff(this.state.startAt || now))
      .asMilliseconds();

    return date(time).utc().format("HH:mm:ss");
  };

  right = () => {
    this.state.module.right();
    this.setState({
      selectedColumn: this.state.module.selectedColumn
    });
  };

  left = () => {
    this.state.module.left();
    this.setState({
      selectedColumn: this.state.module.selectedColumn
    });
  };

  up = (loc: number) => {
    this.state.module.up(loc);
    this.setState({
      selectedPlate: this.state.module.selectedPlate
    });
  };

  drop = (loc: number) => {
    this.state.module.drop(loc);
    this.setState({
      selectedPlate: this.state.module.selectedPlate
    });
  };

  isMinCount = () => {
    return this.state.module.moveCount == this.state.module.minMove;
  };

  onDragOver = (_e: DragEvent<HTMLElement>, loc: number) => {
    console.log("drag over", loc);
  };

  onDrop = (_e: DragEvent<HTMLElement>, loc: number) => {
    console.log("drop", loc);
    this.drop(loc);
    this.setState({
      selectedColumn: this.state.module.selectedColumn
    });
    this.setState({
      selectedPlate: this.state.module.selectedPlate
    });
  };

  onDragStart = (e: DragEvent<HTMLElement>, loc: number, size: number) => {
    e.dataTransfer.setData("plate", size.toString());
    this.up(loc);
    this.setState({
      selectedColumn: this.state.module.selectedColumn
    });
    this.setState({
      selectedPlate: this.state.module.selectedPlate
    });
  };

  render() {
    return (
      <BsContainer
        className={"justify-content-md-center"}
        onKeyDown={this.onKeyDown}
        tabIndex={this.state.end ? 1 : 0}
      >
        <Row className={"my-5 mx-2"}>
          <Col>
            <span
              className={
                this.state.end
                  ? this.isMinCount()
                    ? "text-success"
                    : "text-danger"
                  : ""
              }
            >
              Move Count: {this.state.module.moveCount} / Minimum Move Count:{" "}
              {this.state.module.minMove}
            </span>
          </Col>
          <Col>
            <span className={this.state.end ? "text-success" : ""}>
              Time: {this.state.time + " "}
              <span>{this.state.end ? "(END)" : ""}</span>
            </span>
          </Col>
        </Row>
        <Row className={"mt-5"}>
          <Column
            level={this.state.module.level}
            column={this.state.module.columns[0]}
            selectedPlate={this.state.module.selectedPlate}
            onDragOver={this.onDragOver}
            onDrop={this.onDrop}
            onDragStart={this.onDragStart}
          />
          <Column
            level={this.state.module.level}
            column={this.state.module.columns[1]}
            selectedPlate={this.state.module.selectedPlate}
            onDragOver={this.onDragOver}
            onDrop={this.onDrop}
            onDragStart={this.onDragStart}
          />
          <Column
            level={this.state.module.level}
            column={this.state.module.columns[2]}
            selectedPlate={this.state.module.selectedPlate}
            onDragOver={this.onDragOver}
            onDrop={this.onDrop}
            onDragStart={this.onDragStart}
          />
        </Row>
        <Row className={"mt-4 justify-content-md-center"}>
          <Col className={"text-center"}>
            <Button
              variant={this.state.selectedColumn == 0 ? "primary" : "secondary"}
              className={"w-100"}
            >
              Tower1: Start
            </Button>
          </Col>
          <Col className={"text-center"}>
            <Button
              variant={this.state.selectedColumn == 1 ? "primary" : "secondary"}
              className={"w-100"}
            >
              Tower2
            </Button>
          </Col>
          <Col className={"text-center"}>
            <Button
              variant={this.state.selectedColumn == 2 ? "primary" : "secondary"}
              className={"w-100"}
            >
              Tower3: Target
            </Button>
          </Col>
        </Row>
      </BsContainer>
    );
  }
}

export default Container;
