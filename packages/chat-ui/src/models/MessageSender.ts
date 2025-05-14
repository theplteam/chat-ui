import { ChatMessageContentType, InternalMessageType, Message, MessageModel } from './MessageModel';
import { StreamResponseState, ThreadModel } from './ThreadModel';
import { IdType } from '../types';
import { MessageSentParams } from './MessageSentParams';
import { MessageText } from './MessageText';

export class MessageSender<DM extends Message> {
  constructor(
    public readonly content: Message['content'],
    private userMessage: MessageModel<DM>,
    private assistantMessage: MessageModel<DM>,
    private thread: ThreadModel<DM>,
  ) {
  }

  private _finished = false;

  setText = (text: string) => {
    if (!this._finished) {
      this.changeTypingStatus(true);
    }
    this.assistantMessage.text = text;
  }

  pushChunk = (chunk: string) => {
    if (!this.assistantMessage.text && this.thread.streamStatus.value !== StreamResponseState.TYPING_MESSAGE) {
      this.thread.streamStatus.value = StreamResponseState.TYPING_MESSAGE;
    }
    this.assistantMessage.text += chunk;
  }

  setStatus = (status: string) => {
    this.thread.streamStatus.value = status;
  }

  changeTypingStatus = (status: boolean) => {
    if (status !== this.assistantMessage.typing.value) {
      this.assistantMessage.typing.value = status;
      if (!status) {
        this._finished = true;
      }
    }
  }

  updateCurrentTextIndex = () => {
    this.assistantMessage.texts.value = [
      ...this.assistantMessage.texts.value,
      new MessageText(''),
    ];
  }

  getUserParams = (
    resolver: (params: { message: InternalMessageType }) => void,
    getInternalMessage: (message: MessageModel) => InternalMessageType,
  ): MessageSentParams => {
    const message = this.assistantMessage;

    const internalUserMessage = getInternalMessage(this.userMessage);
    return {
      content: this.content,
      history: this.thread.messages.currentMessages.value.map(getInternalMessage),
      message: internalUserMessage,
      assistantMessage: getInternalMessage(message),
      pushChunk: this.pushChunk,
      setText: this.setText,
      setStatus: this.setStatus,
      onFinish: () => {
        this.changeTypingStatus(false);
        resolver({ message: internalUserMessage });
        message.reasoningManager.updateTimeSec();
        this.thread.isTyping.value = false;

        message.data.content = message.texts.value.map((v) => ({
          type: ChatMessageContentType.TEXT,
          text: v.text,
        }));
      },
      reasoning: {
        pushChunk: (chunk) => {
          if (this.thread.streamStatus.value !== StreamResponseState.THINKING) {
            this.thread.streamStatus.value = StreamResponseState.THINKING;
          }
          message.reasoningManager.pushChunk(chunk);
        },
        setFull: message.reasoningManager.setText,
        setTitle: message.reasoningManager.setUserHeader,
        setTimeSec: message.reasoningManager.setUserTimeSec,
        setViewType: message.reasoningManager.setUserViewType,
        unlockAutoManagement: message.reasoningManager.unlockAutoManagment,
      },
      actions: {
        updateThreadId: (newId: IdType) => this.thread.data.setId(newId),
        updateThreadTitle: (newTitle) => this.thread.data.observableTitle.value = newTitle,
        updateUserMessageId: (newId: IdType) => this.userMessage.data.id = newId,
        updateAssistantMessageId: (newId: IdType) => message.data.id = newId,
        updateCurrentTextIndex: this.updateCurrentTextIndex,
      },
    }
  }
}
