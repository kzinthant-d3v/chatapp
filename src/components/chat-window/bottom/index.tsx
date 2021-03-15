/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {useCallback, useState} from 'react';
import {Alert, Icon, Input, InputGroup} from 'rsuite';
import firebase from 'firebase/app';
import {useProfile} from '../../../context/ProfileContext';
import {useParams} from 'react-router-dom';
import {database} from '../../../misc/firebase';
import AttachmentBtnModal from './AttachmentBtnModal';
import AudioMessageBtn from './AudioMessageBtn';

function assembleMessage(profile, chatId) {
  return {
    text: '',
    roomId: chatId,
    author: {
      name: profile.name,
      uid: profile.userid,
      createdAt: profile.createdAt,
      ...(profile.avatar ? {avatar: profile.avatar} : {}),
    },
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    likeCount: 0,
  };
}
const Bottom: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {profile} = useProfile();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const {chatId} = useParams();
  const onInputChange = useCallback((value) => {
    setInput(value);
  }, []);
  const onSendClick = async () => {
    if (input.trim() === '') {
      return;
    }
    const msgData = assembleMessage(profile, chatId);
    msgData.text = input;

    const updates = {};

    const messageId = database.ref('messages').push().key;
    updates[`/messages/${messageId}`] = msgData;
    updates[`/rooms/${chatId}/lastMessage`] = {
      ...msgData,
      msgId: messageId,
    };
    setIsLoading(true);
    try {
      await database.ref().update(updates);
      setInput('');
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      Alert.error(err.message, 4000);
    }
  };
  const onKeyDown = (evt) => {
    if (evt.keyCode === 13) {
      evt.preventDefault();
      onSendClick();
    }
  };

  const afterUpload = useCallback(
    async (files) => {
      setIsLoading(true);
      const updates = {};
      files.forEach((file) => {
        const msgData = assembleMessage(profile, chatId);
        //@ts-ignore
        msgData.file = file;
        const messageId = database.ref('messages').push().key;

        updates[`/messages/${messageId}`] = msgData;
      });
      const lastMsgId = Object.keys(updates).pop();
      updates[`/rooms/${chatId}/lastMessage`] = {
        ...updates[lastMsgId],
        msgId: lastMsgId,
      };

      try {
        await database.ref().update(updates);
        setInput('');
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        Alert.error(err.message, 4000);
      }
    },
    [chatId, profile]
  );
  return (
    <div>
      <InputGroup>
        <AttachmentBtnModal afterUpload={afterUpload} />
        <AudioMessageBtn afterUpload={afterUpload} />
        <Input
          placeholder="Write a new message here..."
          value={input}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
        />

        <InputGroup.Button
          color="blue"
          appearance="primary"
          onClick={onSendClick}
          disabled={isLoading}
        >
          <Icon icon="send" />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
};

export default Bottom;
