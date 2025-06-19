import * as React from 'react';
import { useChatSlots } from '../core/ChatSlotsContext';
import { MessageModel } from '../../models/MessageModel';
import { ThreadModel } from '../../models/ThreadModel';
import { useGroupedMessages } from './hooks/useGroupedMessages';
import MessagesInGroup from './MessagesInGroup';
import { arrayPluckAndJoin } from '../../utils/arrayUtils/arrayPluckAndJoin';
import { useObserverValue } from '../hooks/useObserverValue';
import MessageComponentSkeleton from './MessageComponentSkeleton';

type Props = {
  messages: MessageModel[];
  thread: ThreadModel;
  gap: number;
};

const MessagesList: React.FC<Props> = ({ messages, thread, gap }) => {
  const { slots } = useChatSlots();
  const groupedMessages = useGroupedMessages(messages);
  const isFullDataLoading = useObserverValue(thread.isLoadingFullData);

  return (
    <>
      <slots.firstMessage thread={thread} />
      {groupedMessages.map((groupMessages, key) => (
        <MessagesInGroup
          key={arrayPluckAndJoin(groupMessages, 'viewerUniqueKey', '-')}
          messages={groupMessages}
          gap={gap}
          isLatestGroup={key === groupedMessages.length - 1}
          thread={thread}
        />
      ))}
      {!!isFullDataLoading && (
        <MessageComponentSkeleton gap={gap} />
      )}
    </>
  );
}

export default React.memo(MessagesList, (prevProps, nextProps) => {
  return prevProps.thread.viewerUniqueKey === nextProps.thread.viewerUniqueKey
    && arrayPluckAndJoin(prevProps.messages, 'viewerUniqueKey') === arrayPluckAndJoin(nextProps.messages, 'viewerUniqueKey');
});
