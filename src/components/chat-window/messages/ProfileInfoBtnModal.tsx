import React from 'react';
import {Button, Modal} from 'rsuite';
import useModalState from '../../../hooks/useModalState';
import ProfileAvatar from '../../ProfileAvatar';

const ProfileInfoBtnModal = ({profile, children, ...btnProps}) => {
  const {toggle, close, open} = useModalState();
  const shortName = profile.name.split(' ')[0];
  const {name, avatar, createdAt} = profile;
  const memeberSince = new Date(createdAt).toLocaleDateString();
  return (
    <>
      <Button {...btnProps} onClick={open}>
        {shortName}
      </Button>
      <Modal show={toggle} onHide={close}>
        <Modal.Header>
          <Modal.Title>{shortName} profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <ProfileAvatar
            src={avatar}
            name={name}
            className="width-200 height-200 img-fullsize font-huge"
          />
          <h4 className="mt-2">{name}</h4>
          <p>Memeber since {memeberSince}</p>
        </Modal.Body>
        <Modal.Footer>
          {children}
          <Button block onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileInfoBtnModal;
