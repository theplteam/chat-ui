import * as React from 'react';
import { ChatMessageOwner, ThreadModel, MessageModel } from '../../models';
import { randomId } from '../../utils/numberUtils/randomInt';
import ChatMessageComponent from '../message/MessageComponent';
import { ForceStream } from '../../models/stream/ForceStream';

type Props = {
  text?: string;
  thread?: ThreadModel;
};

const HelloMessage: React.FC<Props> = ({ text, thread }) => {
  const [message] = React.useState(new MessageModel({
    id: 'helloMessage' + randomId(),
    content: '',
    role: ChatMessageOwner.ASSISTANT,
    time: 0
  }));

  React.useEffect(() => {
    if (!thread || !text) return;

    if (thread.messages.allMessages.value.length > 0) {
      message.texts.value[0].observableText.value = text;
      return;
    }

    message.texts.value[0].observableText.value = '';
    const stream = new ForceStream(text, message);
    stream.chunkSize = 'medium';
    stream.speed = { min: 50, max: 200 };
    stream.start();

    return () => {
      stream.forceStop();
    }
  }, [thread?.id, text]);

  if (!thread || !text) return null;

  return (
    <ChatMessageComponent
      key="helloMessage"
      message={message}
      isLatest={false}
      isFirst={false}
      thread={thread}
      enableAssistantActions={false}
    />
  );
};

export default HelloMessage;
