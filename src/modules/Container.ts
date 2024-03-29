import {
  Container as ContainerInterface,
  Plate as PlateInterface,
  Column as ColumnInterface
} from '../types';

class Container implements ContainerInterface {
  private readonly _level: number;
  private readonly _minMove: number;

  private _moveCount: number;
  private _time: number;

  private readonly _columns: ColumnInterface[];
  private _prevColumn: number;
  private _selectColumn: number;
  private _selectPlate: PlateInterface | null;

  private static readonly _RIGHT = 1;
  private static readonly _LEFT = -1;

  constructor(level: number, columns: ColumnInterface[]) {
    this._level = level;
    this._minMove = 2 ** level - 1;

    this._moveCount = 0;
    this._time = 0;
    this._columns = columns;
    this._selectPlate = null;
    this._selectColumn = 0;
    this._prevColumn = 0;
  }

  get columns(): ColumnInterface[] {
    return this._columns;
  }

  get level(): number {
    return this._level;
  }

  get minMove(): number {
    return this._minMove;
  }

  get moveCount(): number {
    return this._moveCount;
  }

  set time(time: number) {
    if (this._moveCount) {
      this._time = time;
    }
  }

  get time(): number {
    return this._time;
  }

  get selectedColumn(): number {
    return this._selectColumn;
  }

  get selectedPlate(): PlateInterface | null {
    return this._selectPlate;
  }

  get prevColumn(): number {
    return this._prevColumn;
  }

  set prevColumn(value: number) {
    this._prevColumn = value;
  }

  private move(direction: number) {
    this._selectColumn += direction;
    if (this._selectColumn < 0) {
      this._selectColumn = this._columns.length - 1;
    } else if (this._selectColumn > this._columns.length - 1) {
      this._selectColumn = 0;
    }
  }

  public left() {
    this.move(Container._LEFT);
  }

  public right() {
    this.move(Container._RIGHT);
  }

  private select(loc?: number, drop?: boolean) {
    this._selectColumn = loc === undefined ? this._selectColumn : loc;
    if (this._selectPlate == null) {
      if (!drop) {
        this._prevColumn = this._selectColumn;
      }
      this._selectPlate =
        this._columns[this._selectColumn].stack[
          this._columns[this._selectColumn].top
        ];
      if (this._selectPlate) {
        this._selectPlate.selected = true;
      }
    } else {
      const selectedPlate = this._columns[this._prevColumn].pop();
      if (selectedPlate?.selected && selectedPlate === this._selectPlate) {
        if (!this._columns[this._selectColumn].push(selectedPlate)) {
          this._columns[this._prevColumn].push(selectedPlate);
        }
      } else if (selectedPlate) {
        this._columns[this._prevColumn].push(selectedPlate);
      }

      this._selectPlate.selected = false;
      this._selectPlate = null;
      this._moveCount += 1;
    }
  }

  public drop(loc?: number) {
    this.select(loc, true);
  }

  public up(loc?: number) {
    this.select(loc, false);
  }
}

export default Container;
