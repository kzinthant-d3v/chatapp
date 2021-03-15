import React, {useCallback} from 'react';
import {Alert, Icon, InputGroup} from 'rsuite';
import {ReactMic} from 'react-mic';
import {storage} from '../../../misc/firebase';
import {useParams} from 'react-router-dom';

const AudioMessageBtn = ({afterUpload}) => {
  const {chatId} = useParams<Record<string, string | undefined>>();
  const [isRecording, setIsRecording] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  const onClick = useCallback(() => {
    setIsRecording((p) => !p);
  }, []);
  const onUpload = React.useCallback(
    async (data) => {
      console.log('Recording');
      console.log(data);
      setIsUploading(true);
      try {
        const snap = await storage
          .ref(`/chat/${chatId}`)
          .child(`audio_${Date.now()}.mp3`)
          .put(data.blob, {
            cacheControl: `public, max-age=${3600 * 24 * 3}`,
          });

        const file = {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await snap.ref.getDownloadURL(),
        };
        setIsUploading(false);
        afterUpload([file]);
      } catch (err) {
        setIsUploading(false);
        Alert.error(err.message, 4000);
      }
    },
    [afterUpload, chatId]
  );
  return (
    <>
      <InputGroup.Button
        onClick={onClick}
        disabled={isUploading}
        className={isRecording ? 'animate-blink' : ''}
      >
        <Icon icon="microphone" />
        <ReactMic
          record={isRecording}
          className="d-none"
          onStop={onUpload}
          mimeType="audio/mp3"
        ></ReactMic>
      </InputGroup.Button>
    </>
  );
};

export default AudioMessageBtn;
