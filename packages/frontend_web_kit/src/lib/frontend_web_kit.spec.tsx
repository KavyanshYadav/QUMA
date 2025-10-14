import { render } from '@testing-library/react';

import QumaWebkit from './frontend_web_kit.js';

describe('QumaWebkit', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<QumaWebkit />);
    expect(baseElement).toBeTruthy();
  });
});
