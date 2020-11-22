import { css, Global, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

export const GlobalStyles = (
  <Global
    styles={css`
      html {
        color: rgb(191, 191, 191);
        background: rgb(31, 31, 31);
        font-family: sans-serif;
      }

      a {
        color: rgb(140, 140, 250);
      }

      input,
      select,
      textarea,
      button {
        background-color: rgb(31, 31, 31);
        border-radius: 4px;
      }
    `}
  />
);

export const pulse = keyframes`
  from {
    transform: scale(1);
  }
  50% {
    transform: scale(0.8);
  }
  to {
    transform: scale(1);
  }
`;

export const AnimatedPulse = styled.div<{ isPaused?: boolean }>`
  animation-name: ${pulse};
  animation-duration: 4s;
  animation-iteration-count: infinite;

  ${(p) =>
    p.isPaused &&
    css`
      animation-name: unset;
    `}
`;
