import React, { type ComponentPropsWithoutRef } from 'react';
import { Link } from 'react-router-dom';

type ButtonProps = ComponentPropsWithoutRef<'button'> & { to?: never };

type AnchorProps = ComponentPropsWithoutRef<'a'> & { to?: string };

function isAnchorProps(props: ButtonProps | AnchorProps): props is AnchorProps {
  return 'to' in props;
}

const Button: React.FC<ButtonProps | AnchorProps> = (props) => {
  if (isAnchorProps(props)) {
    return <Link to="" {...props} className=""></Link>;
  }
  return (
    <button {...props} className=" bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark"></button>
  );
};

export default Button;
