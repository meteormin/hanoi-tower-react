import React, { KeyboardEvent, DragEvent, useState, useEffect } from 'react';
import { Container as BsContainer, Row, Col, Button } from 'react-bootstrap';
import { ContainerProps, Plate } from '../types';
import Column from './Column';
import { date } from '../helpers';
import moment from 'moment';
import AutomaticSolver from './AutomaticSolver';

function Container({ module, onReset, autoConfig }: ContainerProps) {
  const [selectedColumn, setSelectedColumn] = useState<number>(0);
  const [selectedPlate, setSelectedPlate] = useState<Plate | null>(null);
  const [start, setStart] = useState<boolean>(false);
  const [end, setEnd] = useState<boolean>(false);
  const [startAt, setStartAt] = useState<moment.Moment | null>(null);
  const [time, setTime] = useState<string>('00:00:00');
  const [timerId, setTimerId] = useState<NodeJS.Timer | null>(null);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [isAuto, setIsAuto] = useState<boolean>(false);

  const resetState = () => {
    endTimer();
    setSelectedColumn(0);
    setSelectedPlate(null);
    setStart(false);
    setEnd(false);
    setStartAt(null);
    setTime('00:00:00');
    setTimerId(null);
    setMoveCount(0);
    setIsAuto(false);
  };

  const startTimer = () => {
    const timer = setInterval(() => {
      setTime(getTimeString());
    }, 1000);

    setTimerId(timer);
  };

  const getTimeString = () => {
    const now = date(date.now());
    const time = date.duration(now.diff(startAt || now)).asMilliseconds();

    return date(time).utc().format('HH:mm:ss');
  };

  const endTimer = () => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
      setEnd(true);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    e.preventDefault();
    console.log(e);
    switch (e.code) {
      case 'Space':
        if (selectedPlate) {
          drop(selectedColumn);
        } else {
          up(selectedColumn);
        }
        break;
      case 'ArrowRight':
        right();
        break;
      case 'ArrowLeft':
        left();
        break;
      case 'KeyR':
        resetState();
        onReset(module.level);
        break;
      case 'KeyA':
        handleAuto();
        break;
    }
  };

  const right = () => {
    module.right();
    setSelectedColumn(module.selectedColumn);
    setMoveCount(module.moveCount);
  };

  const left = () => {
    module.left();
    setSelectedColumn(module.selectedColumn);
    setMoveCount(module.moveCount);
  };

  const up = (loc: number) => {
    module.up(loc);
    setSelectedPlate(module.selectedPlate);
    setMoveCount(module.moveCount);
  };

  const drop = (loc: number) => {
    module.drop(loc);
    setSelectedPlate(module.selectedPlate);
    setMoveCount(module.moveCount);
  };

  const isMinCount = () => {
    return module.moveCount == module.minMove;
  };

  const handleDragOver = (_e: DragEvent<HTMLElement>, loc: number) => {
    console.log('drag over', loc);
  };

  const handleDrop = (_e: DragEvent<HTMLElement>, loc: number) => {
    console.log('drop', loc);
    drop(loc);
  };

  const handleDragStart = (
    e: DragEvent<HTMLElement>,
    loc: number,
    size: number
  ) => {
    e.dataTransfer.setData('plate', size.toString());
    up(loc);
  };

  const handleAuto = () => {
    setStartAt(moment());
    setStart(true);
    setIsAuto(true);

    const delayTime = autoConfig?.delay || 500;

    const solver = AutomaticSolver(module, {
      right,
      left,
      up,
      drop
    });

    solver.run(delayTime);
  };

  useEffect(() => {
    resetState();
  }, [module.level]);

  useEffect(() => {
    if (!start && module.moveCount != 0) {
      setStartAt(moment());
      setStart(true);
    }

    if (module.columns[2].stack.length == module.level) {
      endTimer();
    }
  }, [selectedPlate]);

  useEffect(() => {
    if (startAt != null) {
      startTimer();
    }
  }, [startAt]);

  useEffect(() => {
    if (isAuto) {
      if (isMinCount()) {
        endTimer();
      }
    }
  }, [time, isAuto]);

  return (
    <BsContainer
      className='justify-content-md-center'
      onKeyDown={handleKeyDown}
      tabIndex={end ? 1 : 0}
    >
      <Row className='my-5 mx-2'>
        <Col>
          <span
            className={
              end ? (isMinCount() ? 'text-success' : 'text-danger') : ''
            }
          >
            Move Count: {moveCount} / Minimum Move Count: {module.minMove}
          </span>
        </Col>
        <Col>
          <span className={end ? 'text-success' : ''}>
            Time: {time + ' '}
            <span>{end ? '(END)' : ''}</span>
          </span>
        </Col>
      </Row>
      <Row className='mt-5'>
        {module.columns.map((col, index) => {
          return (
            <Column
              key={index}
              column={col}
              selectedPlate={selectedPlate}
              level={module.level}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
            />
          );
        })}
      </Row>
      <Row className='mt-4 justify-content-md-center'>
        <Col className='text-center'>
          <Button
            variant={selectedColumn == 0 ? 'primary' : 'secondary'}
            className='w-100'
          >
            Tower1: Start
          </Button>
        </Col>
        <Col className='text-center'>
          <Button
            variant={selectedColumn == 1 ? 'primary' : 'secondary'}
            className='w-100'
          >
            Tower2
          </Button>
        </Col>
        <Col className='text-center'>
          <Button
            variant={selectedColumn == 2 ? 'primary' : 'secondary'}
            className='w-100'
          >
            Tower3: Target
          </Button>
        </Col>
      </Row>
    </BsContainer>
  );
}

export default Container;
