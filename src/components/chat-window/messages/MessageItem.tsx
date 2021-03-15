/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {useEffect, useState} from 'react';
import ProfileAvatar from '../../ProfileAvatar';
import TimeAgo from 'timeago-react';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';
import PresenceDot from '../../PresenceDot';
import {Button} from 'rsuite';
import {useCurrentRoom} from '../../../context/CurrentRoomContext';
import {auth} from '../../../misc/firebase';
import useHover from '../../../hooks/useHover';
import IconBtnControl from './IconBtnControl';
import {useMediaQuery} from '../../../hooks/useMediaQuery';
import ImgBtnModal from './ImgBtnModal';

const renderFileMessage = (file) => {
  if (file.contentType.includes('image')) {
    return (
      <div className="height-220">
        <ImgBtnModal src={file.url} fileName={file.name} />
      </div>
    );
  }
  if (file.contentType.includes('audio')) {
    return (
      <audio controls>
        <source src={file.url} type="audio/mp3" />
        Your browser does not support audio element.
      </audio>
    );
  }
  return <a href={file.url}>Download {file.name}</a>;
};
const MessageItem = ({message, handleAdmin, handleLike, handleDelete}) => {
  const {author, createdAt, text, file, likes, likeCount} = message;
  const [selfRef, isHover] = useHover();
  const isMobile = useMediaQuery('(max-width: 992px)');

  const isAdmin = useCurrentRoom((v) => v.isAdmin);
  const admins = useCurrentRoom((v) => v.admins);

  //@ts-ignore
  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAdmin = isAdmin && !isAuthor;
  const canShowIcons = isMobile || isHover;
  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);

  return (
    <li
      className={`padded mb-1 cursor-pointer ${isHover ? 'bg-black-02' : ''}`}
      //@ts-ignore
      ref={selfRef}
    >
      <div className="d-flex align-items-center font-bolder mb-1">
        <PresenceDot uid={author.uid} />
        <ProfileAvatar
          src={author.avatar}
          name={author.name}
          className="ml-1"
          size="xs"
        />
        <span className="ml-2"></span>
        <ProfileInfoBtnModal
          profile={author}
          appearance="link"
          className="p-0 ml-1 text-black"
        >
          {canGrantAdmin && (
            <Button block color="blue" onClick={() => handleAdmin(author.uid)}>
              {isMsgAuthorAdmin ? 'Remove admin permission' : 'Grant as admin'}
            </Button>
          )}
        </ProfileInfoBtnModal>
        <TimeAgo
          datetime={createdAt}
          className="font-normal text-black-45 ml-2"
        />
        <IconBtnControl
          {...(isLiked ? {color: 'red'} : {})}
          isVisible={canShowIcons}
          iconName="heart"
          tooltip="Like this message"
          onClick={() => {
            handleLike(message.id);
          }}
          badgeContent={likeCount}
        />
        {isAuthor && (
          <IconBtnControl
            {...(isLiked ? {color: 'red'} : {})}
            isVisible={canShowIcons}
            iconName="close"
            tooltip="Delete this message"
            onClick={() => {
              handleDelete(message.id, file);
            }}
            badgeContent=""
          />
        )}
      </div>
      <div>
        {text && <span className="word-breal-all">{text}</span>}
        {file && renderFileMessage(file)}
      </div>
    </li>
  );
};

export default React.memo(MessageItem);
