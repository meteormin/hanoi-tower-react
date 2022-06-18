import { Plate as PlateInterface } from '../types';

class Plate implements PlateInterface {
  private _bottom: PlateInterface | null;
  private _size: number;
  private _selected: boolean;
  private _top: PlateInterface | null;

  constructor(size: number) {
    this._size = size;
    this._top = null;
    this._bottom = null;
    this._selected = false;
  }

  get size(): number {
    return this._size;
  }

  set size(value: number) {
    this._size = value;
  }

  get bottom(): PlateInterface | null {
    return this._bottom;
  }

  set bottom(value: PlateInterface | null) {
    this._bottom = value;
  }

  get top(): PlateInterface | null {
    return this._top;
  }

  set top(value: PlateInterface | null) {
    this._top = value;
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
  }
}

export default Plate;
