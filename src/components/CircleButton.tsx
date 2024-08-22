import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ComponentProps, memo } from 'react';
import theme from '../styling/theme';

type CircleButtonProps = {
  size?: number;
  borderWidth?: number;
  color?: string;
};

const CircleButtonStyled = styled.button<CircleButtonProps>`
  ${(p) => css`
    width: ${p.size}px;
    height: ${p.size}px;
  `}

  border-radius: 50%;
  color: ${(p) => p.color};

  ${(p) => css`
    border: ${p.borderWidth}px solid ${p.color};
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

const CircleButton = ({
  type = 'button',
  size = 148,
  borderWidth = 8,
  color = theme.colors.green['500'],
  ...props
}: ComponentProps<typeof CircleButtonStyled>) => (
  <CircleButtonStyled
    type={type}
    size={size}
    borderWidth={borderWidth}
    color={color}
    {...props}
  />
);

export default memo(CircleButton);
