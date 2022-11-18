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
