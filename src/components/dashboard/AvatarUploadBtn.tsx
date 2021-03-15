/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import {Alert, Button, Modal} from 'rsuite';
import useModalState from '../../hooks/useModalState';
import AvatarEditor from 'react-avatar-editor';
import {database, storage} from '../../misc/firebase';
import {useProfile} from '../../context/ProfileContext';
import ProfileAvatar from '../ProfileAvatar';
import {getUserUpdates} from '../../misc/helper';

const fileInputTypes = '.png, .jpeg, .jpg';
const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/png'];
const isValidFile = (file) => acceptedFileTypes.includes(file.type);
const getBlob = (canvas) => {
  return new Promise((res, rej) => {
    canvas.toBlob((blob) => {
      if (blob) {
        res(blob);
      } else {
        rej(new Error('File Process Error'));
      }
    });
  });
};
const AvatarUploadBtn: React.FC = () => {
  const [img, setImg] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const avatarEditor = React.useRef();
  const {profile} = useProfile();

  const onFileInputChange = (evt) => {
    const currentFiles = evt.target.files;
    if (currentFiles.length === 1) {
      const file = currentFiles[0];
      if (isValidFile(file)) {
        setImg(file);
        open();
      } else {
        Alert.warning(`Wrong file type ${file.type}`, 4000);
      }
    }
  };
  const onUploadClick = async () => {
    close();
    //@ts-ignore
    const canvas = avatarEditor.current.getImageScaledToCanvas();
    setIsLoading(true);
    try {
      //@ts-ignore
      const blob: Blob = await getBlob(canvas);
      const avatarFileRef = storage
        .ref(`/profile/${profile.userid}`)
        .child('avatar');
      const uploadAvatarResult = await avatarFileRef.put(blob, {
        cacheControl: `public, max-age=${3600 * 24 * 3}`,
      });
      const downloadUrl = await uploadAvatarResult.ref.getDownloadURL();
      const updates = await getUserUpdates(
        profile.userid,
        'avatar',
        downloadUrl,
        database
      );
      await database.ref().update(updates);

      setIsLoading(false);
      Alert.info('Avatar is uploaded successfully', 4000);
    } catch (err) {
      setIsLoading(false);
      Alert.error(err.message, 4000);
    }
  };
  const {toggle, open, close} = useModalState();
  return (
    <div className="mt-3 text-center">
      <ProfileAvatar
        name={profile.name}
        src={profile.avatar}
        className="width-200 height-200 img-fullsize font-huge"
      />

      <div>
        <label
          htmlFor="avatar-upload"
          className="d-block cursor-pointer padded"
        >
          Select new avatar
          <input
            id="avatar-upload"
            type="file"
            className="d-none"
            accept={fileInputTypes}
            onChange={onFileInputChange}
          />
        </label>
        <Modal show={toggle} onHide={close}>
          <Modal.Title>Adjust and upload new avatar</Modal.Title>
          <Modal.Header></Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-center align-items-center h-100">
              {img && (
                <AvatarEditor
                  ref={avatarEditor}
                  image={img}
                  width={200}
                  height={200}
                  border={10}
                  borderRadius={100}
                  rotate={0}
                ></AvatarEditor>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              block
              appearance="ghost"
              onClick={onUploadClick}
              disabled={isLoading}
            >
              Upload new Avatar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarUploadBtn;
