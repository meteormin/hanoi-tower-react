import { Container } from '../types';

export interface Methods {
  left: () => any;
  right: () => any;
  up: (loc: number) => any;
  drop: (loc: number) => any;
}

const AutomaticSolver = (
  module: Container,
  bindingMethod: Methods
): {
  run: (delayTime: number) => void;
} => {
  const delay = async (time: number) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };

  const moveTo = async (to: number, callback: () => any) => {
    if (module.selectedColumn != to) {
      const dist = module.selectedColumn + 1 - (to + 1);
      if (dist > 0) {
        if (dist > 1) {
          bindingMethod.right();
        } else {
          bindingMethod.left();
        }
      } else {
        if (dist < -1) {
          bindingMethod.left();
        } else {
          bindingMethod.right();
        }
      }
    }
    await callback();
  };

  const move = async (start: number, target: number, delayTime: number) => {
    await moveTo(start, async () => {
      await delay(delayTime);
      bindingMethod.up(module.selectedColumn);
    });

    await delay(delayTime);

    await moveTo(target, async () => {
      await delay(delayTime);
      bindingMethod.drop(module.selectedColumn);
    });
  };

  const solve = async (
    disk: number,
    start: number,
    aux: number,
    target: number,
    delayTime: number
  ): Promise<void> => {
    if (disk == 1) {
      await move(start, target, delayTime);
      return;
    }

    await solve(disk - 1, start, target, aux, delayTime);

    await move(start, target, delayTime);

    await solve(disk - 1, aux, start, target, delayTime);
  };

  return {
    run: (delayTime) => {
      solve(module.level, 0, 1, 2, delayTime).then(() =>
        console.log('end automatic')
      );
    }
  };
};

export default AutomaticSolver;
