import Container from './Container';
import Column from './Column';
import Plate from './Plate';

export const makeContainerModule = (level: number): Container => {
  const columns = [];

  for (let i = 0; i < 3; i++) {
    columns.push(new Column(i));
  }

  for (let i = level; i > 0; i--) {
    columns[0].push(new Plate(i));
  }

  return new Container(level, columns);
};

export const findAnswer = (c: Container): Container => {
  const disk = c.level;
  const start = 0;
  const aux = 1;
  const target = 2;

  const moveTo = (to: number, callback: () => any) => {
    if (c.selectedColumn != to) {
      const dist = c.selectedColumn + 1 - (to + 1);
      if (dist > 0) {
        for (let i = 0; i < dist; i++) {
          c.left();
        }
      } else {
        for (let i = 0; i < -1 * dist; i++) {
          c.right();
        }
      }
    }
    callback();
  };

  const move = (start: number, target: number) => {
    console.log(`move ${start} > ${target}`);
    moveTo(start, () => c.up(c.selectedColumn));

    console.log(`column: ${c.selectedColumn},plate: ${c.selectedPlate?.size}`);
    moveTo(target, () => c.drop(c.selectedColumn));
  };

  const recursive = (
    disk: number,
    start: number,
    aux: number,
    target: number
  ): void => {
    if (disk == 1) {
      move(start, target);
      return;
    }

    recursive(disk - 1, start, target, aux);

    move(start, target);

    recursive(disk - 1, aux, start, target);
  };

  recursive(disk, start, aux, target);

  return c;
};
