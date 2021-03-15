/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import {useParams} from 'react-router-dom';
import {Alert, Button, Drawer} from 'rsuite';
import {useCurrentRoom} from '../../../context/CurrentRoomContext';
import useModalState from '../../../hooks/useModalState';
import {database} from '../../../misc/firebase';
import EditableInput from '../../dashboard/EditableInput';

const EditRoomBtnDrawer: React.FC = () => {
  const {toggle, open, close} = useModalState();
  const name = useCurrentRoom((v) => v.name);
  const description = useCurrentRoom((v) => v.description);

  const {chatId} = useParams<Record<string, string | undefined>>();

  const updateData = (key, value) => {
    database
      .ref(`rooms/${chatId}`)
      .child(key)
      .set(value)
      .then(() => {
        Alert.success(`Successfully updated`, 4000);
      })
      .catch((err) => {
        Alert.error(err.message, 4000);
      });
  };
  const onNameSave = (newName) => {
    updateData('name', newName);
  };
  const onDescriptionSave = (newDesc) => {
    updateData('description', newDesc);
  };

  return (
    <div>
      <Button className="br-circle" size="sm" color="red" onClick={open}>
        A
      </Button>
      <Drawer show={toggle} onHide={close} placement="right">
        <Drawer.Header>
          <Drawer.Title>Edit Room</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <EditableInput
            //@ts-ignore
            initialValue={name}
            onSave={onNameSave}
            label={<h6 className="mb-2">Name</h6>}
            emptyMsg="Name cannot be empty"
          />
          <EditableInput
            componentClass="textarea"
            rows={5}
            //@ts-ignore
            initialValue={description}
            onSave={onDescriptionSave}
            emptyMsg="Description cannot be empty"
            wrapperClassName="mt-3"
          />
        </Drawer.Body>
        <Drawer.Footer></Drawer.Footer>
      </Drawer>
    </div>
  );
};

export default React.memo(EditRoomBtnDrawer);
