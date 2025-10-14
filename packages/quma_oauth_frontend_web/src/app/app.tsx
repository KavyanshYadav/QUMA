// import NxWelcome from './nx-welcome.js';
import './index.css';
import { UserResponseDto } from '@quma/types';
import { Button, ThemeProvider, useTheme, Input } from '@quma/webkit';
import { css } from '@emotion/react';
import LoginScreen from './pages/loginScreen.js';
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

  return (
    <ThemeProvider>
      <LoginScreen />
    </ThemeProvider>
  );
}

export default App;
