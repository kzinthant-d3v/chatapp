import {useEffect, useState} from 'react';
import {database} from '../misc/firebase';

export function usePresence(uid: string) {
  const [presence, setPresence] = useState(null);

  useEffect(() => {
    const userStatusRef = database.ref(`/status/${uid}`);
    userStatusRef.on('value', (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setPresence(data);
      }
    });
    return () => {
      userStatusRef.off();
    };
  }, [uid]);

  return presence;
}
