import React from 'react';
import {Button, Modal} from 'rsuite';
import {useCurrentRoom} from '../../../context/CurrentRoomContext';
import useModalState from '../../../hooks/useModalState';

const RoomInfoBtnModal: React.FC = () => {
  const {toggle, close, open} = useModalState();
  const description = useCurrentRoom((v) => v.description);
  const name = useCurrentRoom((v) => v.name);

  return (
    <>
      <Button appearance="link" className="px-0" onClick={open}>
        Room Information
      </Button>
      <Modal show={toggle} onHide={close}>
        <Modal.Header>
          <Modal.Title>About {name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6 className="mb-1">Description</h6>
          <p>{description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button block onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default React.memo(RoomInfoBtnModal);
