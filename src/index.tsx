import React, { Fragment, useEffect, useState } from "react";
import Container from "./components/Contrainer";
import { ContainerModule, makeContainerModule } from "./modules";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export interface HanoiTowerProps {
  level?: number;
}

const HanoiTower = (props: HanoiTowerProps) => {
  const [module, setModule] = useState<ContainerModule>();
  useEffect(() => {
    setModule(makeContainerModule(props.level || 3));
  }, []);

  useEffect(() => {
    if (props.level) {
      setModule(makeContainerModule(props.level || 3));
    }
  }, [props]);

  return <Fragment>{module ? <Container module={module} /> : null}</Fragment>;
};

export default HanoiTower;
