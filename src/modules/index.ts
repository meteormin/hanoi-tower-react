import Container from './Container';
import Column from './Column';
import Plate from './Plate';

export class ContainerModule extends Container {}

export class ColumnModule extends Column {}

export class PlateModule extends Plate {}

export const makeContainerModule = (level: number): ContainerModule =>
  new ContainerModule(level, {
    Column: ColumnModule,
    Plate: PlateModule
  });
