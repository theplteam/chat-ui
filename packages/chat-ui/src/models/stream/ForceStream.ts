import { MessageModel } from '../../models/MessageModel';
import { PromiseUtils } from '../../utils/PromiseUtils';
import { arrayChunk } from '../../utils/arrayUtils/arrayChunk';
import { randomInt } from '../../utils/numberUtils/randomInt';

export class ForceStream {

  private _promise?: PromiseUtils<boolean>;

  private _stop = false;

  // пауза в ms между таймаутами
  speed = { max: 300, min: 100 };

  // пауза в ms между таймаутами
  chunkSize: 'small' | 'medium' | 'large' = 'medium';

  constructor(
    private _text: string,
    private model?: MessageModel,
    private onPushTextPart?: (text: string) => void,
  ) {}

  get promise() {
    return this._promise?.promise;
  }

  start = () => {
    const textChunk = this._text.split(' ');

    const rndSize = this.chunkSize === 'small'
      ? { min: 1, max: 4 }
      : this.chunkSize === 'medium'
        ? { min: 2, max: 6 }
        : { min: 4, max: 8 };

    const chunk = arrayChunk(textChunk, () => randomInt(rndSize.min, rndSize.max)).map(v => v.join(' '));

    this._promise = new PromiseUtils();
    this._addTextPart(chunk);
  }

  forceStop = () => {
    this._stop = true;
  }

  private _addTextPart = (chunks: string[]) => {
    const part = chunks[0];
    const newChunks = chunks.slice(1);
    if (this.model) {
      this.model.text += `${part} `;
    } else if (this.onPushTextPart) {
      this.onPushTextPart(`${part} `);
    }
    if (newChunks.length && !this._stop) {
      setTimeout(
        () => this._addTextPart(newChunks),
        randomInt(100, 300),
      )
    } else {
      this._promise?.resolve(true);
    }
  }
}
