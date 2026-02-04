import React from 'react';
import { css, keyframes } from '@emotion/react';
import { useTheme } from '../ThemeProvider';

const shimmerAnimation = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

interface SkeletonLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  borderRadius?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  borderRadius,
  ...rest
}) => {
  const { theme } = useTheme();

  const skeletonStyle = css`
    position: absolute;
    inset: 0;
    z-index: 10;
    background: linear-gradient(
      90deg,
      var(--quma-muted, ${theme.colors.muted}) 25%,
      var(--quma-secondary, ${theme.colors.secondary}) 50%,
      var(--quma-muted, ${theme.colors.muted}) 75%
    );
    background-size: 200% 100%;
    animation: ${shimmerAnimation} 1.2s infinite linear;
    border-radius: ${borderRadius ?? `var(--quma-radius-md, ${theme.layout.radius.md})`};
  `;

  return <div css={skeletonStyle} {...rest} />;
};
