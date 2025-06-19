import * as React from 'react';
import { ChatMessageOwner, ThreadModel, MessageModel } from '../../models';
import { randomId } from '../../utils/numberUtils/randomInt';
import ChatMessageComponent from '../message/MessageComponent';
import { ForceStream } from '../../models/stream/ForceStream';
import { useChatContext } from '../core/ChatGlobalContext';

type Props = {
  thread: ThreadModel;
};

const InitialThreadMessage: React.FC<Props> = ({ thread }) => {
  const { initialThreadMessage } = useChatContext();
  const messageConfig = React.useMemo(() => initialThreadMessage?.(thread.id), [thread.id]);

  const [message] = React.useState(new MessageModel({
    id: 'helloMessage' + randomId(),
    content: '',
    role: ChatMessageOwner.ASSISTANT,
    time: 0
  }));

  React.useEffect(() => {
    if (!messageConfig) return;
    if (!messageConfig.stream) {
      message.texts.value[0].observableText.value = messageConfig.text;
    } else {
      message.texts.value[0].observableText.value = '';
      message.typing.value = true;
      const stream = new ForceStream(messageConfig.text, message);
      stream.start();
    }
  }, [thread.id, messageConfig]);

  if (!messageConfig) return null;

  return (
    <ChatMessageComponent
      key="helloMessage"
      isLatest
      message={message}
      isFirst={false}
      thread={thread}
      enableAssistantActions={false}
    />
  );
};

export default InitialThreadMessage;
