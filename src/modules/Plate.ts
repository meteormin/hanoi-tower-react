import { Plate as PlateInterface } from '../types';

class Plate implements PlateInterface {
  private _size: number;
  private _selected: boolean;

  constructor(size: number) {
    this._size = size;
    this._selected = false;
  }

  get size(): number {
    return this._size;
  }

  set size(value: number) {
    this._size = value;
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
  }
}

export default Plate;
