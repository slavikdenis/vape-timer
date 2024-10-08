import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ButtonHTMLAttributes, memo, ReactNode } from 'react';
import theme from '../styling/theme';

type ButtonVariant = 'default' | 'primary';

const primaryStyles = css`
  border-color: ${theme.colors.green['500']};
  color: ${theme.colors.green['500']};

  &:hover {
    box-shadow: 0 0 40px 40px ${theme.colors.green['500']} inset;
  }
`;

const disabledStyles = css`
  cursor: not-allowed;
  opacity: 0.5;
  transition: none;

  &:hover,
  &:focus {
    box-shadow: none;
  }
`;

const minimalStyles = css`
  padding: 1em 1.2em;
`;

const StyledButton = styled.button<{
  variant: ButtonVariant;
  minimal: boolean;
  fullWidth: boolean;
}>`
  display: flex-inline;
  align-self: center;
  justify-content: center;
  align-items: center;

  background-color: transparent;
  border: 2px solid #ffffff;
  border-radius: 0.6em;
  color: #ffffff;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 1.2em 2.8em;
  text-decoration: none;
  text-align: center;
  text-transform: uppercase;
  font-weight: 700;
  transition:
    box-shadow 300ms ease-in-out,
    color 300ms ease-in-out;

  ${(p) => p.minimal && minimalStyles}

  ${(p) =>
    p.fullWidth &&
    css`
      width: 100%;
    `}

  &:hover,
  &:focus {
    color: #fff;
    outline: 0;
  }

  &:hover {
    box-shadow: 0 0 40px 40px #2d2d2d inset;
  }

  ${(p) => p.variant === 'primary' && primaryStyles}

  ${(p) => p.disabled && disabledStyles}
`;

type ButtonProps = {
  variant?: ButtonVariant;
  minimal?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  variant = 'default',
  minimal = false,
  fullWidth = false,
  children,
  type = 'button',
  ...buttonProps
}: ButtonProps) => (
  <StyledButton
    type={type}
    variant={variant}
    minimal={minimal}
    fullWidth={fullWidth}
    {...buttonProps}
  >
    {children}
  </StyledButton>
);

export default memo(Button);
