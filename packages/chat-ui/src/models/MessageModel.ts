import { ObservableReactValue } from '../utils/observers/ObservableReactValue';
import { IdType } from '../types';
import { MessageReasoningModel } from './MessageReasoningModel';
import { randomInt } from '../utils/numberUtils/randomInt';
import { MessageText } from './MessageText';
import { arrayLast } from '../utils/arrayUtils/arrayLast';

export enum ChatMessageOwner {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export enum ChatMessageContentType {
  FILE = 'file',
  TEXT = 'text',
  IMAGE = 'image',
}

export type RatingType = 'like' | 'dislike';

export type MessageFeedbackTagType = { id: IdType, label: string, value: string | number };

export type FileContent = { 
  type: ChatMessageContentType.FILE, 
  url?: string,
  base64?: string,
};

export type ImageContent = {
  type: ChatMessageContentType.IMAGE,
  url?: string,
  base64?: string,
}

export type TextContent = {
  type: ChatMessageContentType.TEXT,
  text: string,
}

export type Attachment = ImageContent | FileContent;
// TODO: Should be "external", because it's a type of message that we return to the user in their format
export type InternalMessageType = any;

export type MessageUserContent = string | (Attachment | TextContent)[];
export type MessageAssistantContent = string | (TextContent)[];

export type Message = {
  id: IdType;
  parentId?: IdType;
  time?: number;
  rating?: RatingType;
  reasoning?: {
    title?: string;
    text?: string;
    timeSec?: number;
  };
} & ({
  role: ChatMessageOwner.USER;
  content: MessageUserContent;
} | {
  role: ChatMessageOwner.ASSISTANT;
  content: MessageAssistantContent;
})

export class MessageModel<DM extends Message = Message> {
  /**
   * Text of message that supports "observation", should you need to update the component immediately upon variable modification, perfect for React.useSyncExternalStore.
   */
  readonly texts = new ObservableReactValue<MessageText[]>([]);

  readonly reasoningManager = new MessageReasoningModel();

  attachments: Attachment[] = [];

  /**
   * An observable flag indicating the start/finish of message typing.
   */
  typing = new ObservableReactValue(false);

  photoswipeContainerId = 'photoswipe-container-' + randomInt(100, 100000);

  constructor(private _data: DM) {
    if (typeof _data.content === 'string') {
      this.texts.value = [new MessageText(_data.content)];
    } else {
      const content = Array.isArray(_data.content) ? _data.content : [_data.content];
      this.texts.value = (content.filter(v => v.type === 'text') as TextContent[]).map(
        (text) => new MessageText(text.text)
      );
      this.attachments = content.filter(v => v.type !== ChatMessageContentType.TEXT);
    }

    if (_data.reasoning) {
      if (_data.reasoning.title) {
        this.reasoningManager.title.value = _data.reasoning.title;
      }

      if (_data.reasoning.text) {
        this.reasoningManager.text.value = _data.reasoning.text;
      }

      if (_data.reasoning.timeSec) {
        this.reasoningManager.timeSec.value = _data.reasoning.timeSec;
      }
    }
  }

  get id() {
    return this._data.id;
  }

  get data() {
    return this._data;
  }

  get parentId() {
    return this._data.parentId;
  }

  set parentId(val: IdType|undefined) {
    this._data.parentId = val;
  }
  
  get rating() {
    return this._data.rating;
  }

  set rating(value) {
    this._data.rating = value;
  }

  get time() {
    return this._data.time;
  }

  get role() {
    return this._data.role;
  }

  get isUser() {
    return this.role === ChatMessageOwner.USER;
  }

  get isAssistant() {
    return this.role === ChatMessageOwner.ASSISTANT;
  }

  get images() {
    return this.attachments.filter((a) => a.type === ChatMessageContentType.IMAGE);
  }

  get files() {
    return this.attachments.filter((a) => a.type === ChatMessageContentType.FILE);
  }

  get content() {
    let data: Message['content'] = this.text;

    if (this.attachments?.length) {
      data = [ { type: ChatMessageContentType.TEXT, text: this.text }, ...this.attachments];
    }

    return data;
  }

  get text() {
    return arrayLast(this.texts.value)?.text ?? '';
  }

  set text(value: string) {
    const textModel = arrayLast(this.texts.value);
    if (textModel) {
      textModel.text = value;
    }
  }

  setId = (id: string) => {
    this._data.id = id;
  }
}
