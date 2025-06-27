import { MessageModel, ChatMessageOwner, Message } from './MessageModel';
import moment from 'moment';
import { v4 as uuid, v4 as uuidv4 } from 'uuid';
import { ThreadMessages } from './ThreadMessages';
import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { randomId } from '../utils/numberUtils/randomInt';
import { MessageSentParams } from './MessageSentParams';
import { IdType } from '../types';
import { ToolType } from '../types/ToolType';

export type NewMessageResponse = {
  user: Message,
  assistant: Message,
};

export enum StreamResponseState {
  START = 'start',
  TYPING_MESSAGE = 'typingMessage',
  THINKING = 'thinking',
  FINISH_MESSAGE = 'finishMessage',
}

export type Thread<DM extends Message = any> = {
  id: IdType;
  title: string;
  date?: string;
  messages?: DM[];
} & { isNew?: boolean };

export class ThreadModel<DM extends Message = any, DD extends Thread<DM> = any> {
  /*@observable.shallow
  private readonly _messages: ChatMessage[] = [];*/

  readonly viewerUniqueKey = uuid();

  readonly messages = new ThreadMessages<DM>();

  readonly observableTitle = new ObservableReactValue('');

  readonly isTyping = new ObservableReactValue(false);

  readonly isLoadingAttachments = new ObservableReactValue<IdType[]>([]);

  readonly isEmpty = new ObservableReactValue(false);

  readonly streamStatus = new ObservableReactValue<StreamResponseState | undefined | string>(undefined);

  readonly tool = new ObservableReactValue<ToolType | undefined>(undefined);

  /**
   * We can pass threads with empty history to improve performance
   * When opening such a thread, we need to call the getFullThread method to load the history
   */
  readonly isLoadingFullData = new ObservableReactValue(true);

  scrollY = -1;

  // private _threadCreating?: ApiMethodPromise<{ thread: DD }>;

  // диалог уже создан на сервере, но пользователь ещё не отправил ни одного сообщения.
  // Установим этот ID сразу после отправки сообщения
  // private potentialId?: IdType;

  readonly timestamp: ObservableReactValue<number>;

  private _data: DD;

  constructor(
    data: DD,
    public readonly streamMessage: (params: MessageSentParams) => void | Promise<void>,
  ) {
    this._data = data;
    this.observableTitle.value = data.title;
    this.streamStatus.value = StreamResponseState.FINISH_MESSAGE;

    /*if (!_data.messages.find(v => !!v.parentId)) {
      const newMessages: DD['messages'] = [];

      let parentId: IdType | undefined = undefined;
      _data.messages.forEach(v => {
        newMessages.push({
          ...v,
          parentId,
        });
        if (v.role === ChatMessageOwner.USER) {
          parentId = v.id;
        }
      });

      _data.messages = newMessages
    }*/

    this.messages.allMessages.value = data.messages?.map(v => new MessageModel(v)) ?? [];

    this.isEmpty.value = !!data.isNew;

    if (!!data.messages?.length || data.isNew) {
      this.isLoadingFullData.value = false;
    }

    this.timestamp = new ObservableReactValue(moment(data.date).unix());
  }

  get id() {
    return this._data.id;
  }

  set id(value: IdType) {
    this._data.id = value;
  }

  get time() {
    return this.timestamp.value ?? 0;
  }

  get title() {
    return this.observableTitle.value;
  }

  set title(value: string) {
    this.observableTitle.value = value;
  }

  get date() {
    return this._data.date;
  }

  get isNew() {
    return this._data.isNew;
  }

  get messagesArray() {
    return this.messages.allMessagesArray;
  }

  get data(): Thread<DM> {
    return this._data;
  }

  setFullData = (threadData: Thread & { messages: DM[] }) => {
    this.messages.allMessages.value = threadData.messages?.map(v => new MessageModel(v)) ?? [];
    this.isLoadingFullData.value = false;
  }

  static createEmptyData = <DD>() => {
    return ({
      id: 'NEW_THREAD_' + randomId(),
      title: 'New thread',
      date: (new Date()).toISOString(),
      messages: [],
      isNew: true,
    }) as DD;
  }

  protected _createPair = (content: Message['content'], parentMessage: MessageModel<DM> | undefined) => {
    const userMessage = new MessageModel({
      id: uuidv4(),
      content,
      role: ChatMessageOwner.USER,
      time: moment().unix(),
      parentId: parentMessage?.id,
    } as DM);

    const assistantMessage = new MessageModel({
      id: 'NEW_MESSAGE_' + randomId(),
      content: '',
      role: ChatMessageOwner.ASSISTANT,
      // должно быть больше для правильной сортировки
      time: moment().unix() + 1,
      parentId: userMessage.id,
    } as DM);

    return {
      userMessage, assistantMessage,
    };
  }
}
