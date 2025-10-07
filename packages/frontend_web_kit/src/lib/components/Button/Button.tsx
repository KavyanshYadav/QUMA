import { css } from '@emotion/react';

export const niceButtonStyle = css`
  padding: 0.5rem 1.5rem;
  background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;

  cursor: pointer;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;

  &:hover {
    background: linear-gradient(90deg, #1e40af 0%, #2563eb 100%);
    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.25);
    transform: translateY(-2px) scale(1.03);
  }

  &:active {
    background: #1e3a8a;
    box-shadow: 0 1px 4px rgba(37, 99, 235, 0.1);
    transform: translateY(0) scale(0.98);
  }

  &:focus {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
`;
export const Button = () => {
  const style = css`
    background-color: blue;
  `;
  return (
    <div>
      <div css={niceButtonStyle}>Button</div>
    </div>
  );
};
