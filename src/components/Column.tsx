import React, { DragEvent, useEffect, useState } from 'react';
import {
  ColumnProps,
  Column as ColumnInterface,
  Plate as PlateInterface
} from '../types';
import { Button, Col, Row } from 'react-bootstrap';
import Plate from './Plate';

function makeBlank(index: number) {
  return (
    <Row key={index} className='justify-content-md-center'>
      <Col md='auto'>
        <Button variant='outline-light' disabled className='w-100' />
      </Col>
    </Row>
  );
}

function makePlate(
  level: number,
  plates: PlateInterface[],
  loc: number,
  handleDragStart: (e: DragEvent<HTMLElement>, loc: number, size: number) => any
): JSX.Element[] {
  if (plates.length != 0) {
    const blank = [];
    for (let i = 0; i < level - plates.length; i++) {
      blank.push(makeBlank(i));
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
                  handleDragStart(e, loc, size);
                }}
              />
            );
          }
          return <Plate key={'p' + i} size={p.size} selected={p.selected} />;
        })
        .reverse()
    );
  }
  return [];
}

function Column(props: ColumnProps) {
  const [column, setColumn] = useState<ColumnInterface>();
  const [plate, setPlate] = useState<JSX.Element[]>();
  const [level, setLevel] = useState<number>();

  const resetState = () => {
    setColumn(props.column);
    setLevel(props.level);
  };

  const handleDragOver = (e: DragEvent<HTMLElement>) => {
    if (column) {
      e.preventDefault();
      props.onDragOver(e, column.loc);
    }
  };

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    if (column) {
      props.onDrop(e, column.loc);
    }
  };

  useEffect(() => {
    resetState();
  }, []);

  useEffect(() => {
    if (level && column) {
      setPlate(makePlate(level, column.stack, column.loc, props.onDragStart));
    }
  }, [level, column]);

  useEffect(() => {
    setColumn(props.column);
  }, [props.column.stack.length]);

  useEffect(() => {
    if (level && column) {
      setPlate(makePlate(level, column.stack, column.loc, props.onDragStart));
    }
  }, [props.selectedPlate]);

  return (
    <Col
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className='mt-4 border rounded'
    >
      {plate?.length ? plate : null}
    </Col>
  );
}

export default Column;
