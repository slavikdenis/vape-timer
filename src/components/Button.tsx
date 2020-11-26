import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ButtonHTMLAttributes, memo } from 'react';

type ButtonVariant = 'default' | 'primary';

const primaryStyles = css`
  border-color: #26af76;
  color: #26af76;

  &:hover {
    box-shadow: 0 0 40px 40px #26af76 inset;
  }
`;

const StyledButton = styled.button<{ variant: ButtonVariant }>`
  display: flex;
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
  margin: 14px;
  padding: 1.2em 2.8em;
  text-decoration: none;
  text-align: center;
  text-transform: uppercase;
  font-weight: 700;
  transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;

  &:hover,
  &:focus {
    color: #fff;
    outline: 0;
  }

  &:hover {
    box-shadow: 0 0 40px 40px #2d2d2d inset;
  }

  ${(p) => p.variant === 'primary' && primaryStyles}
`;

const Button: React.FC<
  { variant?: ButtonVariant } & ButtonHTMLAttributes<HTMLButtonElement>
> = ({ variant = 'default', children, ...buttonProps }) => {
  return (
    <StyledButton variant={variant} {...buttonProps}>
      {children}
    </StyledButton>
  );
};

Button.defaultProps = {
  type: 'button',
};

export default memo(Button);
