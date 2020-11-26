import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { memo } from 'react';

type CircleButtonProps = { size?: number; borderWidth?: number };

const CircleButton = styled.button<CircleButtonProps>`
  ${(p) => css`
    width: ${p.size}px;
    height: ${p.size}px;
  `}

  border-radius: 50%;
  color: #26af76;

  ${(p) => css`
    border: ${p.borderWidth}px solid #26af76;
  `}

  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  text-decoration: none;
  text-align: center;
  text-transform: uppercase;
  font-weight: 700;
  transition: border-color 300ms ease-in-out;
  color: white;

  &:hover,
  &:focus {
    border-color: #fff;
    outline: 0;
  }
`;

CircleButton.defaultProps = {
  type: 'button',
  size: 148,
  borderWidth: 8,
};

export default memo(CircleButton);
