import Chat from './views/Chat';
import ChatPage from './views/chatUi/ChatPage';
import History from './views/leftContainer/History';
import ChatLicenseInfo from './views/utils/ChatLicenseInfo';
import { NewChatButton, NewChatIconButton, useChatContext } from './views';
import { useThreadContext } from './views/thread/ThreadContext';
import { useAssistantAnswerMock } from './views/core/useAssistantAnswerMock';
import { useChatApiRef } from './views/hooks/useChatApiRef';
import type { ApiRefType } from './views/core/useApiRef';
import type { ChatUsersProps } from './views/core/useChatProps';
import { chatClassNames } from './views/core/chatClassNames';
import { onShowAlertType } from './types/onShowAlertType';
import { historyClassNames } from './views/core/history/historyClassNames';
import MobileHistory from './views/leftContainer/MobileHistory';
import { ToolType } from './types/ToolType';

export * from './models';
export * from './views/adapter';
// TODO: Hard fix
export * from './temporalExports';

type ChatApiRef = ApiRefType | null;

export {
  Chat,
  ChatPage,
  History,
  MobileHistory,
  NewChatButton,
  NewChatIconButton,
  useChatContext,
  useThreadContext,
  ChatLicenseInfo,
  useAssistantAnswerMock,
  useChatApiRef,
  type ChatApiRef,
  chatClassNames,
  historyClassNames,
  type onShowAlertType,
  ChatUsersProps as ChatProps,
  type ToolType,
};
