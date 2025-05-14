import { Message } from './MessageModel';
import { Thread } from './ThreadData';
import { ObservableReactValue } from '../utils/observers';
import { ThreadModel } from './ThreadModel';
import { ChatActions } from './ChatActions';
import { AdapterType } from '../views/adapter/AdapterType';
import { MessageSentParams } from './MessageSentParams';
import { ThreadListCache } from './ThreadListCache';

export class Threads<DM extends Message, DD extends Thread<DM>> {
  readonly list = new ObservableReactValue<ThreadModel<DM, DD>[]>([]);

  readonly currentThread = new ObservableReactValue<ThreadModel<DM, DD> | undefined>(undefined);

  readonly actions = new ChatActions();

  readonly listGroups = new ThreadListCache();

  constructor(
    adapter: AdapterType,
    threads: Thread[],
    thread: Thread | undefined,
    onUserMessageSent: (params: MessageSentParams) => void | Promise<void>,
  ) {
    const threadConstructor = ((t: Thread)=> new ThreadModel(
      t as DD,
      onUserMessageSent,
    ));

    this.list.value = threads.map(threadConstructor);
    if (thread?.id) {
      this.currentThread.value = this.get(thread.id);
    }
  }

  get = (id: DD['id']) => {
    return this.list.value.find(d => d.id === id);
  }

  delete = (id: DD['id']) => {
    const thread = this.get(id);
    if (thread) {
      this.list.value = this.list.value.filter(d => d.id !== id);
    }
  }

  /**
   * Populates a Thread instance from provided data parameters, or fetches the existing instance
   * if it already exists in the list.
   *
   * @param params - The arguments required to create a Thread instance, including data and a stream function.
   * @returns The existing or newly created Thread instance.
   */
  /*fromData = (...params: ConstructorParameters<typeof ThreadModel<DM, DD>>) => {
    const [data, streamFn] = params;
    let thread = this.get(data.id);
    if (!thread) {
      thread = new ThreadModel(data, streamFn);
      this.list.value = [...this.list.value, thread];
    }
    return thread;
  }*/

  createFromData = (...params: ConstructorParameters<typeof ThreadModel<DM, DD>>) => {
    const [data, streamFn] = params;
    return new ThreadModel(data, streamFn);
  }
}
