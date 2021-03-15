import React from 'react';
import {Modal} from 'rsuite';
import useModalState from '../../../hooks/useModalState';

const ImgBtnModal = ({src, fileName}) => {
  const {toggle, open, close} = useModalState();
  return (
    <>
      <input
        type="image"
        alt="file"
        src={src}
        onClick={open}
        className="mw-100 mh-100 w-auto"
      />
      <Modal show={toggle} onHide={close}>
        <Modal.Header>
          <Modal.Title>{fileName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <img src={src} alt="file" height="100%" width="100%" />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <a href={src} target="_blank" rel="noopener noreferrer">
            View Original
          </a>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ImgBtnModal;
