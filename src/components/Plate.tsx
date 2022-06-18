import React, {Component, DragEvent} from 'react';
import {PlateProps} from '../types';
import {Row, Col, Button} from 'react-bootstrap';

interface PlateState {
  size: number;
  selected: boolean;
}

class Plate extends Component<PlateProps, PlateState> {
  constructor(props: PlateProps) {
    super(props);
    this.state = {size: props.size, selected: props.selected};
  }

  componentDidUpdate(
    prevProps: Readonly<PlateProps>,
    _prevState: Readonly<PlateState>,
    _snapshot?: any,
  ) {
    if (this.props.size != prevProps.size) {
      this.setState({
        size: this.props.size,
      });
    }

    if (this.props.selected != prevProps.selected) {
      this.setState({
        selected: this.props.selected,
      });
    }
  }

  init = () => {
    if (this.state.size != 0) {
      const elements = [];
      for (let i = 0; i < this.state.size; i++) {
        elements.push(
          <Col md={'auto'} key={'plate' + i}>
            <Button
              variant={this.state.selected ? 'primary' : 'secondary'}
              className={'w-100'}
            >
              {this.state.size}
            </Button>
          </Col>,
        );
      }
      return elements;
    }

    return null;
  };

  onDragStart = (e: DragEvent<HTMLElement>) => {
    if (this.props.onDragStart) {
      this.setState({
        selected: true,
      });
      this.props.onDragStart(e, this.state.size);
    } else {
      e.preventDefault();
    }
  };

  render() {
    return (
      <Row
        className={'justify-content-md-center'}
        draggable={!!this.props.onDragStart}
        onDragStart={this.onDragStart}
      >
        {this.init()}
      </Row>
    );
  }
}

export default Plate;
