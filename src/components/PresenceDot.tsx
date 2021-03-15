import React from 'react';
import {Badge, Tooltip, Whisper} from 'rsuite';
import {usePresence} from '../hooks/usePresence';

const PresenceDot = ({uid}) => {
  const presence = usePresence(uid);

  const getText = (presence) => {
    if (!presence) {
      return 'Unknown State';
    }
    return presence.state === 'online'
      ? 'Online'
      : presence.state === 'offline'
      ? `Last Online ${new Date(presence.last_changed).toLocaleDateString()}`
      : 'Unknown';
  };
  const getColor = (presence) => {
    if (!presence) {
      return 'gray';
    }
    switch (presence.state) {
      case 'online':
        return 'green';
      case 'offline':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Whisper
      placement="top"
      trigger="hover"
      speaker={<Tooltip>{getText(presence)}</Tooltip>}
    >
      <Badge
        className="cursor-pointer"
        style={{backgroundColor: getColor(presence)}}
      />
    </Whisper>
  );
};

export default PresenceDot;
