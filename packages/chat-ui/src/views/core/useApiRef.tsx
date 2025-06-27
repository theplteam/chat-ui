import * as React from 'react';
import { Thread, Message, MessageModel, MessageUserContent } from '../../models';
import { NOOP } from '../../utils/NOOP';
import { IdType } from '../../types';
import { ThreadMessages } from '../../models/ThreadMessages';
import { ObservableReactValue } from '../../utils/observers';
import { ThreadListenersMap } from '../thread/ThreadListenersMap';
import { ToolType } from '../../types/ToolType';

export type ApiRefType<DM extends Message = any, DD extends Thread<DM> = any> = {
  /**
   * Get all messages from current thread
   */
  getAllMessages: () => DM[];
  /**
   * Get all threads
   */
  getAllThreads: () => DD[];
  /**
   * Get current thread
   */
  getCurrentThread: () => DD | undefined;
  /**
   * Get thread by id
   */
  getThreadById: (id: IdType) => DD | undefined;
  /**
   * Get messages from current branch
   * @see https://docs.playliner.com/introduction/branching/
   */
  getBranchMessages: () => DM[];
  /**
   * Delete thread by id
   */
  deleteThread: (threadId: IdType) => void;
  /**
   * Send message to conversation
   */
  sendUserMessage: (content: Message['content'], tool?: ToolType) => Promise<boolean>;
  /**
   * Triggered when another thread is opened.
   */
  onChangeThread: (threadId: IdType) => void;
  /**
   * Triggered when a new thread is opened.
   * @param thread
   */
  openNewThread: (thread?: DD) => void;
  /**
   * Set your own waiting status for a chat response.
   */
  setProgressStatus: (status: string) => void;
  /**
   * Get waiting status for a chat response.
   */
  getProgressStatus: () => string;
  /**
   * Change thread branch.
   */
  handleChangeBranch: ThreadMessages<DM>['handleChangeBranch'];
  /**
   * Changes the state of opening the drawer menu.
   */
  setMenuDrawerOpen: (v: boolean) => void,
  /**
   * Changes the value of deleteItem; if there is a value, a confirm dialog opens.
   */
  setDeleteItem: (v: DD | undefined) => void,
  /**
    * Create new thread.
    */
  handleCreateNewThread?: () => DD,
  /**
    * Change current thread.
    */
  onChangeCurrentThread?: (v: DD) => void,
  /**
    * Triggered when thread is deleted.
    */
  onThreadDeleted?: (v: DD) => void,
};

export type PrivateApiRefType<DM extends Message = any, DD extends Thread<DM> = any> = {
  allMessages: ObservableReactValue<Readonly<MessageModel<DM>[]>>;
  branch: ObservableReactValue<Readonly<MessageModel<DM>[]>>;
  getListener: <K extends keyof ThreadListenersMap<DM>>(key: K) => ThreadListenersMap<DM>[K] | undefined;
  updateScrollButtonState: () => void;
  onEditMessage: (newContent: MessageUserContent, messageEdit: MessageModel) => Promise<MessageModel | undefined>;
  getConversationBlockHeight: () => number;
} & ApiRefType<DM, DD>;

export const useApiRef = <DM extends Message, DD extends Thread<DM>>(userApiRef: React.MutableRefObject<ApiRefType | null> | undefined) => {
  const apiRef = React.useRef<PrivateApiRefType<DM, DD>>({
    onChangeThread: NOOP,
    openNewThread: NOOP,
    updateScrollButtonState: NOOP,
    deleteThread: NOOP,
    getProgressStatus: () => '',
    sendUserMessage: () => new Promise((resolve) => setTimeout(resolve, 100)),
    onEditMessage: () => new Promise((resolve) => setTimeout(resolve, 100)),
    setProgressStatus: NOOP,
    handleChangeBranch: NOOP,
    getCurrentThread: () => undefined,
    getThreadById: () => undefined,
    getAllMessages: () => [],
    getBranchMessages: () => [],
    getAllThreads: () => [],
    allMessages: new ObservableReactValue([]),
    branch: new ObservableReactValue([]),
    getListener: () => undefined,
    getConversationBlockHeight: () => 0,
    setMenuDrawerOpen: NOOP,
    setDeleteItem: NOOP,
  });

  React.useMemo(() => {
    if (userApiRef) {
      const { getListener, branch, allMessages, updateScrollButtonState, ...otherProps } = apiRef.current;
      userApiRef.current = otherProps;
    }
  }, [userApiRef]);

  return apiRef;
}
