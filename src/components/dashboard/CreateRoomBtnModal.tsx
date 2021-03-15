/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import {
  Alert,
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Icon,
  Modal,
  Schema,
} from 'rsuite';
import useModalState from '../../hooks/useModalState';
import firebase from 'firebase/app';
import {auth, database} from '../../misc/firebase';

const {StringType} = Schema.Types;
const model = Schema.Model({
  name: StringType().isRequired('Chat name is required'),
  description: StringType().isRequired('Description is required'),
});
const INITAL_FORM = {
  name: '',
  description: '',
};

const CreateRoomBtnModal: React.FC = () => {
  const {toggle, open, close} = useModalState();
  const [formValue, setFormValue] = React.useState(INITAL_FORM);
  const [isLoading, setIsLoading] = React.useState(false);
  const formRef = React.useRef();

  const onFormChange = React.useCallback((value) => {
    setFormValue(value);
  }, []);

  const onSubmit = async () => {
    //@ts-ignore
    if (!formRef.current.check()) {
      return;
    }
    setIsLoading(true);
    const newRoomdata = {
      ...formValue,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      admins: {
        [auth.currentUser.uid]: true,
      },
    };

    try {
      await database.ref(`rooms`).push(newRoomdata);
      setIsLoading(false);
      setFormValue(INITAL_FORM);
      close();
      Alert.info(`${formValue.name} has been created`, 4000);
    } catch (err) {
      setIsLoading(false);
      Alert.error(err.message, 4000);
    }
  };

  return (
    <div className="mt-1">
      <Button block color="green" onClick={open}>
        <Icon icon="creative" /> Create new Chat Room
      </Button>

      <Modal show={toggle} onHide={close}>
        <Modal.Header>New Chat Room</Modal.Header>
        <Modal.Body>
          <Form
            fluid
            onChange={onFormChange}
            formValue={formValue}
            model={model}
            ref={formRef}
          >
            <FormGroup>
              <ControlLabel>Room name</ControlLabel>
              <FormControl
                name="name"
                placeholder="Enter chat room name..."
              ></FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl
                componentClass="textarea"
                rows={5}
                name="description"
                placeholder="Enter room description"
              ></FormControl>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            block
            appearance="primary"
            onClick={onSubmit}
            disabled={isLoading}
          >
            Create New Chat Room
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateRoomBtnModal;
