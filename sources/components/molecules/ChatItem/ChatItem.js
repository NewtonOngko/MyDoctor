import React from 'react';
import IsMe from './IsMe';
import OtherChat from './OtherChat';

const ChatItem = ({isMe, photo, message, time}) => {
  if (isMe) {
    return <IsMe message={message} time={time} />;
  }
  return <OtherChat photo={photo} message={message} time={time} />;
};

export default ChatItem;
