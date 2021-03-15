/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {useCallback} from 'react';
import {useParams} from 'react-router-dom';
import {Alert, Button} from 'rsuite';
import {auth, database, storage} from '../../../misc/firebase';
import {groupBy, transformToArrWithId} from '../../../misc/helper';
import MessageItem from './MessageItem';

const PAGE_SIZE = 15;
const messagesRef = database.ref('/messages');

function shouldScrollToBottom(node, threshold = 30) {
  const percentage =
    (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0;
  return percentage > threshold;
}

const Messages: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const {chatId} = useParams();
  const [messages, setMessages] = React.useState(null);
  const [limit, setLimit] = React.useState(PAGE_SIZE);
  const selfRef = React.useRef();
  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  const loadMessages = React.useCallback(
    (limit = PAGE_SIZE) => {
      const node = selfRef.current;
      messagesRef.off();
      messagesRef
        .orderByChild('roomId')
        .equalTo(chatId)
        .limitToLast(limit || PAGE_SIZE)
        .on('value', (snap) => {
          const data = transformToArrWithId(snap.val());
          if (shouldScrollToBottom(node)) {
            //@ts-ignore
            node.scrollTop = node.scrollHeight;
          }
          setMessages(data);
        });
      setLimit((p) => p + PAGE_SIZE);
      return () => {
        messagesRef.off('value');
      };
    },
    [chatId]
  );

  const onLoadMore = useCallback(() => {
    const node = selfRef.current;
    //@ts-ignore
    const oldHeight = node.scrollHeight;
    loadMessages(limit);
    setTimeout(() => {
      //@ts-ignore
      const newHeight = node.scrollHeight;
      //@ts-ignore
      node.scrollTop = newHeight - oldHeight;
    }, 300);
  }, [loadMessages, limit]);

  React.useEffect(() => {
    const node = selfRef.current;

    loadMessages();
    setTimeout(() => {
      //@ts-ignore
      node.scrollTop = node.scrollHeight;
    }, 300);

    return () => {
      messagesRef.off('value');
    };
  }, [loadMessages]);

  let alertMsg;
  const handleAdmin = useCallback(
    async (uid) => {
      const adminsRef = database.ref(`/rooms/${chatId}/admins`);
      await adminsRef.transaction((admins) => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null;
            alertMsg = 'Admin permission removed';
          } else {
            admins[uid] = true;
            alertMsg = 'Admin permission granted';
          }
        }
        return admins;
      });
      Alert.info(alertMsg, 4000);
    },
    [chatId]
  );

  const handleLike = useCallback(async (msgId) => {
    const {uid} = auth.currentUser;
    const messageRef = database.ref(`/messages/${msgId}`);
    await messageRef.transaction((msg) => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likeCount -= 1;
          msg.likes[uid] = null;
          alertMsg = 'Like removed';
        } else {
          msg.likeCount += 1;
          if (!msg.likes) {
            msg.likes = {};
          }
          msg.likes[uid] = true;
          alertMsg = 'Like added';
        }
      }
      return msg;
    });
    Alert.info(alertMsg, 4000);
  }, []);

  const handleDelete = useCallback(
    async (msgId, file) => {
      if (!window.confirm('Delete this message?')) {
        return;
      }
      const updates = {};
      const isLast = messages[messages.length - 1].id === msgId;

      updates[`/messages/${msgId}`] = null;
      if (isLast && messages.length > 1) {
        updates[`/rooms/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id,
        };
      }
      if (isLast && messages.length === 1) {
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }
      try {
        await database.ref().update(updates);
        Alert.info('Message has been deleted', 4000);
      } catch (err) {
        return Alert.error(err.message, 4000);
      }
      if (file) {
        try {
          const fileRef = storage.refFromURL(file.url);
          fileRef.delete();
        } catch (err) {
          Alert.error(err.message, 4000);
        }
      }
    },
    [chatId, messages]
  );

  const renderMessages = () => {
    const groups = groupBy(messages, (item) =>
      new Date(item.createdAt).toDateString()
    );
    const items = [];

    Object.keys(groups).forEach((date) => {
      items.push(
        <li key={date} className="text-center mb-1 padded">
          {date}
        </li>
      );
      const msgs = groups[date].map((msg) => (
        <MessageItem
          handleAdmin={handleAdmin}
          handleLike={handleLike}
          handleDelete={handleDelete}
          key={msg.id}
          message={msg}
        />
      ));
      items.push(...msgs);
    });
    return items;
  };
  return (
    <ul ref={selfRef} className="msg-list custom-scroll">
      {messages && messages.length >= PAGE_SIZE && (
        <li className="text-center mt-2 mb-2">
          <Button onClick={onLoadMore} color="green">
            Load More
          </Button>
        </li>
      )}
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessages && renderMessages()}
    </ul>
  );
};

export default Messages;
