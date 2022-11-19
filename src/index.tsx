import React, { Fragment, useEffect, useState } from 'react';
import Container from './components/Contrainer';
import { makeContainerModule } from './modules';
import { AutoConfig, Container as ContainerInterface } from './types';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export interface HanoiTowerProps {
  level?: number;
  autoConfig?: AutoConfig;
}

const HanoiTower = (props: HanoiTowerProps) => {
  const [module, setModule] = useState<ContainerInterface>();
  useEffect(() => {
    setModule(makeContainerModule(props.level || 3));
  }, []);

  useEffect(() => {
    if (props.level) {
      setModule(makeContainerModule(props.level || 3));
    }
  }, [props]);

  const handleReset = (level: number) => {
    setModule(makeContainerModule(level));
  };

  return (
    <Fragment>
      {module ? (
        <Container
          module={module}
          onReset={handleReset}
          autoConfig={props.autoConfig}
        />
      ) : null}
    </Fragment>
  );
};

export default HanoiTower;
