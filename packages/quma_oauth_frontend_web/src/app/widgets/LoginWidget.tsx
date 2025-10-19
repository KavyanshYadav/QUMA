import { css } from '@emotion/react';
import { Button, Input, useTheme } from '@quma/webkit';
import React from 'react';
import { FrontendAppRouter, RouteBody, RouteKey } from '@quma/configShared';
const BtnCom = () => {
  type ControllerRequest<K extends RouteKey> = {
    body: RouteBody<K>;
  };

  const f: ControllerRequest<'auth:create:withEmail'> = {
    body: {},
  };

  console.log(FrontendAppRouter);
  const theme = useTheme()?.theme;
  return (
    <Button
      onClick={() => {
        window.open('', windowName, windowFeatures);
      }}
      iconLeft={<span>asdasd</span>}
      label="Google"
      sx={css`
        padding: 1rem;
        background-color: transparent;
        color: ${theme?.colors.text};
        font-size: ${theme?.typography.fontSize.lg};
        border: 2px solid ${theme?.colors.muted};

        &:hover {
          background-color: ${theme?.colors.surface};
        }
      `}
    />
  );
};

function LoginWidget() {
  const theme = useTheme()?.theme;

  return (
    <div
      css={css`
        width: fit-content;
        padding: 2rem;
        margin-bottom: 10rem;
        margin-left: auto;
        margin-right: auto;
        width: 30%;
        //background-color: bisque;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
        `}
      >
        <h1
          css={css`
            font-size: ${theme?.typography.fontSize['3xl']};
            margin: 0;
          `}
        >
          Login or SignUp
        </h1>
        <label
          css={css`
            font-size: ${theme?.typography.fontSize.lg};
            font-weight: ${theme?.typography.fontWeight.medium};
            color: ${theme?.colors.secondary};
            word-wrap: break-word;
            text-align: center;
          `}
        >
          * By siging up you agree to all
          <a
            herf="https://www.google.com"
            css={css`
              text-decoration: underline;
            `}
          >
            {' '}
            terms and conditions
          </a>
        </label>
      </div>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        `}
      >
        <BtnCom />
        <BtnCom />
        <BtnCom />
        <BtnCom />
      </div>
      <div
        css={css`
          position: relative;
          width: 100%;
          margin: 2rem 0;
          text-align: center;
        `}
      >
        <div
          css={css`
            height: 1.2px;
            width: 100%;
            background-color: ${theme?.colors.secondary};
          `}
        />
        <span
          css={css`
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: ${theme?.colors.surface};
            padding: 0 0.5rem;
            font-weight: ${theme?.typography.fontWeight.medium};
            color: ${theme?.colors.secondary};
          `}
        >
          OR
        </span>
      </div>

      <div
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
        `}
      >
        <Input
          sx={css`
            .input-field {
            }
          `}
          label="Enter your email"
        />
        <Button
          label="Continue"
          sx={css`
            margin-top: 1rem;
            background-color: black;
          `}
        />
      </div>

      <div></div>
    </div>
  );
}

export default LoginWidget;
