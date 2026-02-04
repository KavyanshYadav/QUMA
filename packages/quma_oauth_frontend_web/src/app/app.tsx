import './index.css';
import { ThemeProvider } from '@quma/webkit';
import LoginScreen from './pages/loginScreen.js';

export function App() {
  return (
    <ThemeProvider>
      <LoginScreen />
    </ThemeProvider>
  );
}

export default App;
