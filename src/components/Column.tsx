import React, { Component, DragEvent } from 'react';
import {
  ColumnProps,
  Column as ColumnInterface,
  Plate as PlateInterface,
} from '../types';
import { Button, Col, Row } from 'react-bootstrap';
import Plate from './Plate';

interface ColumnState {
  column: ColumnInterface;
  plate: JSX.Element[];
  selectedPlate: PlateInterface | null;
  level: number;
}

class Column extends Component<ColumnProps, ColumnState> {
  constructor(props: ColumnProps) {
    super(props);
    this.state = {
      column: props.column,
      level: props.level,
      plate: this.makePlate(props.column.stack, this.props.level),
      selectedPlate: props.selectedPlate,
    };
  }

  componentDidMount() {
    this.setState({
      column: this.props.column,
      level: this.props.level,
      plate: this.makePlate(this.props.column.stack, this.props.level),
      selectedPlate: this.props.selectedPlate,
    });
  }

  componentDidUpdate(
    prevProps: Readonly<ColumnProps>,
    _prevState: Readonly<ColumnState>,
    _snapshot?: any,
  ) {
    if (this.props.column.stack.length != prevProps.column.stack.length) {
      console.log('ch stack', this.props.column.stack);
      this.setState({
        column: this.props.column,
        plate: this.makePlate(this.props.column.stack, this.props.level),
      });
    }

    if (this.props.selectedPlate != prevProps.selectedPlate) {
      console.log('ch plate', this.props.selectedPlate);
      this.setState({
        plate: this.makePlate(this.props.column.stack, this.props.level),
        selectedPlate: this.state.selectedPlate,
      });
    }
  }

  makeBlank = (index: number) => {
    return (
      <Row key={index} className={'justify-content-md-center'}>
        <Col md={'auto'}>
          <Button
            variant={'outline-light'}
            disabled
            className={'w-100'}
          ></Button>
        </Col>
      </Row>
    );
  };

  makePlate = (plates: PlateInterface[], level: number): JSX.Element[] => {
    if (plates.length != 0) {
      const blank = [];
      for (let i = 0; i < level - plates.length; i++) {
        blank.push(this.makeBlank(i));
      }

      return blank.concat(
        plates
          .map((p, i) => {
            console.log(p);

            if (i == plates.length - 1) {
              return (
                <Plate
                  key={'p' + i}
                  size={p.size}
                  selected={p.selected}
                  onDragStart={(e, size) => {
                    this.props.onDragStart(e, this.props.column.loc, size);
                  }}
                />
              );
            }
            return <Plate key={'p' + i} size={p.size} selected={p.selected} />;
          })
          .reverse(),
      );
    }
    return [];
  };

  onDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    this.props.onDragOver(e, this.state.column.loc);
  };

  onDrop = (e: DragEvent<HTMLElement>) => {
    this.props.onDrop(e, this.state.column.loc);
  };

  render() {
    return (
      <Col
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
        className={'mt-4 border rounded'}
      >
        {this.state.plate.length ? this.state.plate : null}
      </Col>
    );
  }
}

export default Column;
