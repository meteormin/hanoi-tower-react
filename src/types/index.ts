import { DragEvent } from 'react';

export interface Plate {
  size: number;
  selected: boolean;
}

export interface Column {
  stack: Plate[];
  top: number;
  loc: number;

  push(plate: Plate): boolean;

  pop(): Plate | null;

  remove(plate: Plate): boolean;
}

export interface Container {
  columns: Column[];
  level: number;
  prevColumn: number;
  selectedPlate: Plate | null;
  selectedColumn: number;
  moveCount: number;
  minMove: number;
  time: number;

  right(): void;

  left(): void;

  drop(loc: number): void;

  up(loc: number): void;
}

export interface ContainerProps {
  module: Container;
  onReset: (level: number) => any;
}

export interface ColumnProps {
  column: Column;
  selectedPlate: Plate | null;
  level: number;

  onDragOver(e: DragEvent<HTMLElement>, loc: number): any;

  onDrop(e: DragEvent<HTMLElement>, loc: number): any;

  onDragStart(e: DragEvent<HTMLElement>, loc: number, size: number): any;
}

export interface PlateProps {
  size: number;
  selected: boolean;
  onDragStart?: (e: DragEvent<HTMLElement>, size: number) => any;
}
