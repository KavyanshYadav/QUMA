// import NxWelcome from './nx-welcome';
import './index.css';
import { UserResponseDto } from '@quma/quma_types';
import { Route, Routes, Link } from 'react-router-dom';
import { Button, ThemeProvider, useTheme, Input } from '@quma/webkit';
import { css } from '@emotion/react';
import { SkeletonLoader } from 'packages/frontend_web_kit/src/lib/components/Loader/Loader';
import { AUTH_WEB_BASE_URL } from '@quma/config';
import LoginWidget from './widgets/LoginWidget';
import LoginScreen from './pages/loginScreen';
import { MemoryBus } from '@quma/quma_ddd_base';
const StyledApp = css`
  // Your style here
`;

const Name = () => {
  const theme = useTheme();

  return (
    <div>
      <Button loading={true} onClick={() => theme?.toggleTheme()}>
        Name
      </Button>
      <h1
        css={css`
          color: ${theme?.theme.colors.text};
        `}
      >
        Name
      </h1>
    </div>
  );
};

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
  const Me = new MemoryBus();
  console.log(Me);

  return (
    <ThemeProvider>
      <LoginScreen />
    </ThemeProvider>
  );
}

export default App;
