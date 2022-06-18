import { Column as ColumnInterface, Plate } from '../types';

class Column implements ColumnInterface {
  private readonly _loc: number;
  private _stack: Plate[];

  constructor(loc: number) {
    this._loc = loc;
    this._stack = [];
  }

  get top(): number {
    return this._stack.length - 1;
  }

  get stack(): Plate[] {
    return this._stack;
  }

  set stack(value: Plate[]) {
    this._stack = value;
  }

  get loc(): number {
    return this._loc;
  }

  public push(plate: Plate) {
    if (plate.size < this._stack[this.top]?.size || this._stack.length == 0) {
      this._stack.push(plate);
      return true;
    } else {
      return false;
    }
  }

  public pop(): Plate | null {
    if (this._stack[this.top]) {
      return this._stack.pop() as Plate;
    }

    return null;
  }

  public remove(plate: Plate): boolean {
    if (this._stack.length != 0) {
      this._stack = this._stack.filter((p) => {
        return p.size != plate.size;
      });

      return true;
    }

    return false;
  }
}

export default Column;
