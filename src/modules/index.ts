import Container from './Container';
import Column from './Column';
import Plate from './Plate';

export class ContainerModule extends Container {}

export class ColumnModule extends Column {}

export class PlateModule extends Plate {}

export const makeContainerModule = (level: number): ContainerModule => {
  const columns = [];

  for (let i = 0; i < 3; i++) {
    columns.push(new ColumnModule(i));
  }

  for (let i = level; i > 0; i--) {
    columns[0].push(new PlateModule(i));
  }

  return new ContainerModule(level, columns);
};
