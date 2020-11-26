import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

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
