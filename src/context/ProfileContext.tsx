import {createContext, useContext, useEffect, useState} from 'react';
import {auth, database} from '../misc/firebase';
import firebase from 'firebase/app';

interface Profile {
  name: string;
  createdAt: number;
  userid: string;
  email: string;
  avatar?: string;
}
interface IAuthContext {
  profile: Profile;
  isLoading: boolean;
}
export const isOfflineForDatabase = {
  state: 'offline',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

export const isOnlineForDatabase = {
  state: 'online',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};
const ProfileContext = createContext<IAuthContext>(null);

export const ProfileProvider: React.FC = ({children}) => {
  const [profile, setProfile] = useState<Profile>(null);
  const [isLoading, setIsLoading] = useState(true);
  let userRef;
  let userStatusRef;
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authObj) => {
      if (authObj) {
        userStatusRef = database.ref(`/status/${authObj.uid}`);
        userRef = database.ref(`/profiles/${authObj.uid}`);
        userRef.on('value', (snap) => {
          const {name, createdAt, avatar} = snap.val();
          const data = {
            name,
            createdAt,
            avatar,
            userid: authObj.uid,
            email: authObj.email,
          };
          setProfile(data);
          setIsLoading(false);
        });
        database.ref('.info/connected').on('value', (snap) => {
          if (!!snap.val() === false) {
            return;
          }
          userStatusRef
            .onDisconnect()
            .set(isOfflineForDatabase)
            .then(() => {
              userStatusRef.set(isOnlineForDatabase);
            });
        });
      } else {
        if (userRef) {
          userRef.off();
        }
        if (userStatusRef) {
          userStatusRef.off();
        }
        database.ref('.info/connected').off();
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      if (userRef) {
        userRef.off();
      }
      if (userStatusRef) {
        userStatusRef.off();
      }
      database.ref('.info/connected').off();
      unsub();
    };
  }, []);

  return (
    <ProfileContext.Provider value={{isLoading, profile}}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
