import React, {useEffect} from 'react';

export const useMediaQuery = (query) => {
  const [matches, setMatches] = React.useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const queryList = window.matchMedia(query);
    setMatches(queryList.matches);

    const listener = (evt) => setMatches(evt.matches);

    queryList.addEventListener('change', listener);

    return () => queryList.removeEventListener('change', listener);
  }, [query]);

  return matches;
};
