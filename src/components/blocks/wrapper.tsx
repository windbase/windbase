import React from 'react';

type Props = {
  children: React.ReactNode;
};
function BlockWrapper({ children }: Props) {
  return <div>{children}</div>;
}

export default BlockWrapper;
