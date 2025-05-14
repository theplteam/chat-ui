import { ObservableReactValue } from "../utils/observers";
import { randomInt } from "../utils/numberUtils/randomInt";
import { Attachment, ChatMessageContentType } from "./MessageModel";
import { base64FileEncode } from "../utils/base64File";

class MessageAttachmentModel {
  id = randomInt(100, 100000);

  readonly progress = new ObservableReactValue<number>(0);

  private _data: File;

  public url: string;

  constructor(_data: File) {
    this._data = _data;
    this.url = URL.createObjectURL(_data);
  }

  get data() { return this._data; }

  get type() { return this._data.type; }

  get name() { return this._data.name; }

  setProgress = (n: number) => { this.progress.value = n }

  dataToContent = async () => {
    const base64 = await base64FileEncode(this._data)
    const data: Attachment = {
      type: this.type.startsWith('image') ? ChatMessageContentType.IMAGE : ChatMessageContentType.FILE,
      base64: base64,
    };
    return data;
  }

  getImgSize = () => {
    if (!this.type.startsWith('image')) return;
    const image = new Image();
    image.src = this.url;
    return { width: image.width, height: image.height };
  }
}

export default MessageAttachmentModel;
