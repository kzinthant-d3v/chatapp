import React, {useCallback} from 'react';

function useModalState(defaultValue = false) {
  const [toggle, setToggle] = React.useState(defaultValue);

  const open = useCallback(() => setToggle(true), []);
  const close = useCallback(() => setToggle(false), []);

  return {toggle, open, close};
}
export default useModalState;
