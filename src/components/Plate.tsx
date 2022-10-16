import React, { DragEvent, useEffect, useState } from 'react';
import { PlateProps } from '../types';
import { Row, Col, Button } from 'react-bootstrap';

function initElements(size: number, selected: boolean) {
  if (size != 0) {
    return (
      <Col lg={size + 1}>
        <Button variant={selected ? 'primary' : 'secondary'} className='w-100'>
          {size}
        </Button>
      </Col>
    );
  }
  return null;
}

function Plate(props: PlateProps) {
  const [size, setSize] = useState<number>();
  const [selected, setSelected] = useState<boolean>();
  const [elements, setElements] = useState<JSX.Element | null>();

  useEffect(() => {
    setSize(props.size);
    setSelected(props.selected);
  }, [props.size, props.selected]);

  useEffect(() => {
    if (size != undefined && selected != undefined) {
      setElements(initElements(size, selected));
    }
  }, [size, selected]);

  const handleDragStart = (e: DragEvent<HTMLElement>) => {
    if (props.onDragStart && size != undefined) {
      setSelected(true);
      props.onDragStart(e, size);
    } else {
      e.preventDefault();
    }
  };

  return (
    <Row
      className='justify-content-md-center'
      draggable={!!props.onDragStart}
      onDragStart={handleDragStart}
    >
      {elements}
    </Row>
  );
}

export default Plate;
