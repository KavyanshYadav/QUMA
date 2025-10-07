// import NxWelcome from './nx-welcome';
import { UserResponseDto } from '@quma/quma_types';
import { Route, Routes, Link } from 'react-router-dom';
import { Button } from '@quma/webkit';
import { css } from '@emotion/react';
const StyledApp = css`
  // Your style here
`;

export function App() {
  const user = new UserResponseDto(
    'sd',
    'email',
    'name',
    'country',
    new Date(),
    new Date()
  );

  console.log(user);
  return (
    <div>
      <Button>Click me</Button>
      Name
    </div>
  );
}

export default App;
