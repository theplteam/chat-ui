import {
  ThreadModel,
  StreamResponseState,
  TextContent,
  MessageUserContent,
  MessageModel,
  ChatMessageOwner,
  InternalMessageType
} from '../../models';
import { arrayLast } from '../../utils/arrayUtils/arrayLast';
import { ChatUsersProps } from '../core/useChatProps';
import { Threads } from '../../models/Threads';
import { useAdapterContext, useInternalMessageTransformer } from '../adapter/AdapterContext';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment/moment';
import { randomId } from '../../utils/numberUtils/randomInt';
import { MessageSender } from '../../models/MessageSender';

type BeforeUserMessageSendFnParams = {
  text: string;
  content: MessageUserContent;
  history: InternalMessageType[];
  reason: 'editMessage' | 'newMessage';
  parentMessage?: InternalMessageType;
};

export type BeforeUserMessageSendFnType = (params: BeforeUserMessageSendFnParams) => {
  userMessage?: InternalMessageType;
  assistantMessage?: InternalMessageType;
} | Promise<{
  userMessage?: InternalMessageType;
  assistantMessage?: InternalMessageType;
}>;

export const useThreadSendMessage = (
  thread: ThreadModel | undefined,
  model: Threads<any, any>,
  onFirstMessageSent: ChatUsersProps<any, any>['onFirstMessageSent'],
  beforeUserMessageSend: BeforeUserMessageSendFnType | undefined,
  onAssistantMessageTypingFinish: ChatUsersProps<any, any>['onAssistantMessageTypingFinish'],
  scroller?: {
    handleBottomScroll?: () => void;
  }
) => {
  const getInternalMessage = useInternalMessageTransformer();
  const { transformMessage } = useAdapterContext();

  const onCreatePair = async (
    text: string,
    content: MessageUserContent,
    reason: BeforeUserMessageSendFnParams['reason'],
    parentMessage?: MessageModel
  ) => {
    let userMessage: MessageModel;
    let assistantMessage: MessageModel;
    const branchMessages = thread?.messages.currentMessages.value ?? [];

    if (beforeUserMessageSend) {
      // console.log('beforeUserMessageSend', branchMessages);
      const history = branchMessages.map(v => getInternalMessage(v));

      const pairs = await beforeUserMessageSend({
        text, content, history,
        parentMessage: parentMessage ? getInternalMessage(parentMessage) : undefined,
        reason,
      });

      if (pairs.userMessage?.role !== ChatMessageOwner.USER) {
        throw new Error(`userMessage.role must be "user". ${pairs.userMessage?.role} given`);
      }

      if (pairs.assistantMessage?.role !== ChatMessageOwner.ASSISTANT) {
        throw new Error(`userMessage.role must be "assistant". ${pairs.assistantMessage?.role} given`);
      }

      userMessage = new MessageModel(
        transformMessage ? transformMessage(pairs.userMessage) : pairs.userMessage
      );
      assistantMessage = new MessageModel(
        transformMessage ? transformMessage(pairs.assistantMessage) : pairs.assistantMessage
      );
    } else {
      if (!parentMessage) {
        parentMessage = arrayLast(branchMessages);
      }

      userMessage = new MessageModel({
        id: uuidv4(),
        content,
        role: ChatMessageOwner.USER,
        time: moment().unix(),
        parentId: parentMessage?.id,
      });

      assistantMessage = new MessageModel({
        id: 'NEW_MESSAGE_' + randomId(),
        content: '',
        role: ChatMessageOwner.ASSISTANT,
        // должно быть больше для правильной сортировки
        time: moment().unix() + 1,
        parentId: userMessage.id,
      });
    }

    return { userMessage, assistantMessage }

  };

  const onEditMessage = async (newText: string, messageEdit: MessageModel) => {
    if (!thread) return;

    const parentMessage = thread.messagesArray.find(v => v.id === messageEdit.parentId);

    const content: MessageUserContent = [{ type: 'text', text: newText }];
    thread.streamStatus.value = StreamResponseState.START;

    const { userMessage, assistantMessage } = await onCreatePair(newText, content, 'editMessage', parentMessage);

    thread.messages.push(userMessage, assistantMessage);

    onSendMessage(content, userMessage, assistantMessage);

    return userMessage;
  };

  const onSendMessage = (
    content: MessageUserContent,
    userMessage: MessageModel,
    assistantMessage: MessageModel,
  ) => {
    if (!thread) {
      throw new Error('thread is undefined');
    }
    if (typeof content === 'string') {
      content = [{ type: 'text', text: content }];
    }

    thread.isTyping.value = true;
    assistantMessage.typing.value = true;
    const messageSender = new MessageSender(
      content,
      userMessage,
      assistantMessage,
      thread,
    );

    return new Promise<{ message: InternalMessageType }>((resolve, reject) => {
      const streamParams = messageSender.getUserParams(resolve, getInternalMessage);
      const res = thread.streamMessage(messageSender.getUserParams(resolve, getInternalMessage));

      if (res instanceof Promise) {
        res
          .then(streamParams.onFinish)
          .catch((reason) => {
            messageSender.changeTypingStatus(false);
            thread.isTyping.value = false;
            reject(reason);
          });
      }
    });
  };

  const onSendNewsMessage = (content: MessageUserContent) => {
    let text = '';
    let images: string[] = [];

    if (typeof content === 'string') {
      text = content;
    } else if (Array.isArray(content)) {
      text = (content.filter(v => v.type === 'text') as TextContent[])?.[0]?.text ?? '';
      images = content.map(v => v.type === 'image' ? v.url : undefined).filter(v => !!v) as string[];
    }

    return new Promise<boolean>(async (resolve) => {

      if ((images?.length || text) && thread) {
        thread.streamStatus.value = StreamResponseState.START;

        try {
          if (thread.isEmpty.value) {
            if (onFirstMessageSent) {
              await onFirstMessageSent?.({ thread: thread.data.data });
            }

            if (!model.get(thread.id)) {
              model.list.value = [...model.list.value, thread];
            }

            thread.isEmpty.value = false;
          }

          const pair = await onCreatePair(text, content, 'newMessage');

          thread.messages.push(pair.userMessage, pair.assistantMessage);

          onSendMessage(content, pair.userMessage, pair.assistantMessage)
            .then(({ message }) => {
              resolve(true);
              onAssistantMessageTypingFinish?.({ message, thread: thread.data.data });
              thread.streamStatus.value = StreamResponseState.FINISH_MESSAGE;
            })
            .catch(() => resolve(false));

          scroller?.handleBottomScroll?.();
        } catch (e) {
          console.error(e);
          resolve(false);
        }
      }
    });

  };

  return {
    onSendNewsMessage,
    onEditMessage,
  };
}
