import React from 'react';
import {Alert, Button, Divider, Drawer} from 'rsuite';
import {useProfile} from '../../context/ProfileContext';
import {database} from '../../misc/firebase';
import AvatarUploadBtn from './AvatarUploadBtn';
import EditableInput from './EditableInput';
import ProviderBlock from './ProviderBlock';
import {getUserUpdates} from '../../misc/helper';

const Dashboard = ({onSignOut}: {onSignOut: () => void}) => {
  const {profile} = useProfile();
  const onSave = async (newData) => {
    const usernameRef = database
      .ref(`/profiles/${profile.userid}`)
      .child('name');
    try {
      const updates = await getUserUpdates(
        profile.userid,
        'name',
        newData,
        database
      );
      await database.ref().update(updates);

      Alert.success('Nickname updated', 4000);
    } catch (err) {
      Alert.error(err.message, 4000);
    }
  };
  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Dashboard</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <h3>Welcome, {profile.name}</h3>
        <ProviderBlock />
        <Divider />
        <EditableInput
          name="nickname"
          initialValue={profile.name}
          onSave={onSave}
          label={<h6 className="mb-2">Nickname</h6>}
        />
        <AvatarUploadBtn />
      </Drawer.Body>
      <Drawer.Footer>
        <Button block color="red" onClick={onSignOut}>
          Sign Out
        </Button>
      </Drawer.Footer>
    </>
  );
};
export default Dashboard;