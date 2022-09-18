import React, { useState } from 'react';
import HanoiTower from 'hanoi-tower-react';
import { Card } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

const App = () => {
  const [level, setLevel] = useState(3);

  const levelOptions = [
    { name: 'level 1', value: 1 },
    { name: 'level 2', value: 2 },
    { name: 'level 3', value: 3 },
    { name: 'level 4', value: 4 },
    { name: 'level 5', value: 5 },
    { name: 'level 6', value: 6 },
    { name: 'level 7', value: 7 }
  ];

  return (
    <Card>
      <Card.Header>Hanoi Tower</Card.Header>
      <Card.Body>
        <Form.Select
          onChange={(e) => {
            const val = e.target.options[e.target.selectedIndex].value;
            setLevel(parseInt(val));
          }}
          value={level}
        >
          {levelOptions.map((opt, index) => (
            <option key={index} value={opt.value}>
              {opt.name}
            </option>
          ))}
        </Form.Select>
        <HanoiTower level={level} />
      </Card.Body>
    </Card>
  );
};

export default App;
