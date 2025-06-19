import { ObservableReactValue } from "../utils/observers";
import getVideoPoster from "../utils/getVideoPoster";
import { IdType } from "../types";
import md5 from "md5";
import loadUrlFile from "../utils/loadUrlFile";
import { randomInt } from "../utils/numberUtils/randomInt";

export type AttachmentType = 'file' | 'image' | 'video';

export type Attachment = {
  type: AttachmentType,
  id: IdType,
  url: string,
  file?: File,
  poster?: string,
};

const emptyFile = new File([''], 'empty');

class AttachmentModel {
  readonly progress = new ObservableReactValue<number>(0);

  readonly error = new ObservableReactValue<string | undefined>(undefined);

  readonly poster = new ObservableReactValue<HTMLImageElement | undefined>(undefined);

  readonly isLoading = new ObservableReactValue<boolean>(true);

  private _file = emptyFile;

  private _id: IdType = randomInt(1, 1000);

  private _url: string = '';

  constructor(private _data: Partial<Attachment>) {
    this._createSelf();
  }

  get id() { return this._id; }

  get data() { return this._data; }

  get file() { return this._file; }

  get url() { return this._url; }

  get type() { return this._data.type || 'file'; }

  get name() { return this._file.name; }
  
  get isGallery() { return this.type !== 'file'; }

  private _createPoster = async () => {
    const img = document.createElement('img');

    if (this._data.poster) {
      img.src = this._data.poster;
    } else {
      if (this.type.startsWith('image')) {
        img.src = this._url;
      }
      if (this.type.startsWith('video')) {
        img.src = await getVideoPoster(this._url);
      }
    }

    img.onload = () => {
      this.poster.value = img;
    };
  }

  setProgress = (n: number) => { this.progress.value = n }

  setError = (e: string) => { this.error.value = e }

  setId = (id: IdType) => { this._id = id }

  get contentData() {
    const data: Attachment = {
      id: this.id,
      type: this.type,
      file: this.file,
      url: this._url,
      poster: this.poster.value?.src,
    };
    return data;
  }

  private _createSelf = async () => {
    const { file, url, id } = this.data;

    if (file) {
      this._file = file;
      this._url = URL.createObjectURL(this._file);
    } else if(url) {
      const loadedFile = await loadUrlFile(url)
      if (loadedFile) {
        this._file = loadedFile;
        this._url = url;
      }
    }

    this._id = id || md5(this._url);
    this.isLoading.value = false;
    this._createPoster();
  };
}

export default AttachmentModel;
