import React, {useCallback} from 'react';
import {Alert, Button, Drawer, Icon} from 'rsuite';
import Dashboard from '.';
import {isOfflineForDatabase} from '../../context/ProfileContext';
import {useMediaQuery} from '../../hooks/useMediaQuery';
import useModalState from '../../hooks/useModalState';
import {auth, database} from '../../misc/firebase';

const DashboardToggle: React.FC = () => {
  const {toggle, close, open} = useModalState();
  const isMobile = useMediaQuery('(max-width:992px');

  const onSignOut = useCallback(() => {
    database
      .ref(`/status/${auth.currentUser.uid}`)
      .set(isOfflineForDatabase)
      .then(() => {
        auth.signOut();
        Alert.info('Signed out', 4000);
        close();
      })
      .catch((err) => {
        Alert.error(err.message, 4000);
      });
  }, [close]);

  return (
    <>
      <Button block color="blue" onClick={open}>
        <Icon icon="dashboard" />
        Dashboard
      </Button>
      <Drawer full={isMobile} show={toggle} onHide={close} placement="left">
        <Dashboard onSignOut={onSignOut} />
      </Drawer>
    </>
  );
};
export default DashboardToggle;
