import { DragEvent } from 'react';

export interface Plate {
  size: number;
  bottom: Plate | null;
  top: Plate | null;
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
  plates: Plate[];
  level: number;
  prevColumn: number;
  selectedPlate: Plate | null;
  selectedColumn: number;
  moveCount: number;
  minMove: number;
  time: number;

  select(loc?: number, down?: boolean): void;

  right(): void;

  left(): void;
}

export interface ContainerDeps {
  Column: ColumnImpl;
  Plate: PlateImpl;
}

export interface ContainerImpl {
  new (level: number, deps: ContainerDeps): Container;
}

export interface ColumnImpl {
  new (loc: number): Column;
}

export interface PlateImpl {
  new (size: number): Plate;
}

export interface ContainerProps {
  module: Container;
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
