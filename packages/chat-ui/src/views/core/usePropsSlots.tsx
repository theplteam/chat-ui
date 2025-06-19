import * as React from 'react';
import HiddenContent from '../HiddenContent';
import { MockComponent } from '../utils/MockComponent';
import ListItemText, { ListItemTextProps } from '@mui/material/ListItemText';
import Button, { type ButtonProps } from '@mui/material/Button';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import MessageMarkdownTable from '../message/markdown/MessageMarkdownTable';
import MessageMarkdownTableCell from '../message/markdown/MessageMarkdownTableCell';
import { ChatMessageOl, MessageMarkdownUl } from '../message/markdown/MessageMarkdownUl';
import { SlotPropsType } from './SlotPropsType';
import MessageMarkdownImage from '../message/markdown/MessageMarkdownImage';
import MessagePagination from '../message/MessagePagination';
import Stack from '@mui/material/Stack';
import ContainerSubtitle from '../../ui/ContainerSubtitle';
import MessageAssistantProgress from '../message/MessageAssistantProgress';
import MdMenuItem, { MdMenuItemProps } from '../../ui/menu/MdMenuItem';
import { Thread, Message } from '../../models';
import { ChatUsersProps } from './useChatProps';
import InitialThreadMessage from '../thread/InitialThreadMessage';
import MessageMarkdownCode from '../message/markdown/MessageMarkdownCode';
import MessageMarkdownBlockquote from '../message/markdown/MessageMarkdownBlockquote';
import MessageMarkdownCodeWrapper from '../message/markdown/MessageMarkdownCodeWrapper';
import { chatIconSlots, ChatIconSlotsType } from './ChatIconSlots';
import ThreadRootContainer from '../thread/ThreadRootContainer';
import ChatTextFieldRowInner from '../form/ChatTextFieldRowInner';
import ThreadListItemMenuButton from '../leftContainer/ThreadListItemMenuButton';
import { ChatMarkdownBlockRoot } from '../message/markdown/MessageMarkdownBlock';
import { ChatMarkdownReasoningBlockRoot } from '../message/reasoning/MessageReasoningFull';
import { Divider } from '@mui/material';

export type SlotValue<T = any> = React.JSXElementConstructor<T>;

export type CoreSlots = {
  button: SlotValue<ButtonProps>;
  iconButton: SlotValue<IconButtonProps>;
  listItemText: SlotValue<ListItemTextProps>;
  menuItem: SlotValue<MdMenuItemProps>;
};

export type SlotsType<DM extends Message, DD extends Thread<DM>> = { [key in keyof SlotPropsType<DM, DD>]: SlotValue<SlotPropsType<DM, DD>[key]> }
  & ChatIconSlotsType;

// TODO: Kludge because it's inconvenient to use generic every time
export type SlotsTypeEase = SlotsType<any, any>;

type SlotsReturnType<DM extends Message, DD extends Thread<DM>> = {
  slots: SlotsType<DM, DD>;
  coreSlots: CoreSlots;
  slotProps: Partial<SlotPropsType<DM, DD>>;
};

export const usePropsSlots = <DM extends Message, DD extends Thread<DM>>(
  usersProps: ChatUsersProps<DM, DD>
): SlotsReturnType<DM, DD> => {
  const { coreSlots, slots, slotProps } = usersProps;

  const res = React.useMemo(() => {
    const core: CoreSlots = {
      button: coreSlots?.button ?? Button,
      iconButton: coreSlots?.iconButton ?? IconButton,
      // TODO: Props error
      listItemText: coreSlots?.listItemText ?? ListItemText,
      menuItem: coreSlots?.menuItem ?? MdMenuItem,
    };

    const componentSlots: SlotsType<DM, DD> = {
      ...chatIconSlots,
      ...slots,
      firstMessage: slots?.firstMessage ?? InitialThreadMessage,
      thread: slots?.thread ?? ThreadRootContainer,
      listContainer: slots?.threadsList ? HiddenContent : slots?.listContainer ?? HiddenContent,
      threadsList: slots?.threadsList ?? HiddenContent,
      threadListItemMenuButton: slots?.threadListItemMenuButton ?? ThreadListItemMenuButton,
      listDrawer: slots?.threadsList ? HiddenContent : slots?.listDrawer ?? React.Fragment,
      listSubtitle: slots?.listSubtitle ?? ContainerSubtitle,
      listTimeText: slots?.listTimeText ?? Typography,
      listDrawerTitle: slots?.listDrawerTitle ?? Typography,
      sendMessageButton: slots?.sendMessageButton ?? core.iconButton,

      messageRowInner: slots?.messageRowInner ?? ChatTextFieldRowInner,
      // MARKDOWN
      markdownMessageRoot: slots?.markdownMessageRoot ?? ChatMarkdownBlockRoot,
      markdownReasoningRoot: slots?.markdownReasoningRoot ?? ChatMarkdownReasoningBlockRoot,
      markdownA: slots?.markdownA ?? Link,
      markdownTable: slots?.markdownTable ?? MessageMarkdownTable,
      markdownThead: slots?.markdownThead ?? TableHead,
      markdownTbody: slots?.markdownTbody ?? TableBody,
      markdownTh: slots?.markdownTh ?? MessageMarkdownTableCell,
      markdownTd: slots?.markdownTd ?? MessageMarkdownTableCell,
      markdownTdText: slots?.markdownTdText ?? Typography,
      markdownTr: slots?.markdownTr ?? TableRow,
      markdownSpan: slots?.markdownSpan ?? Typography,
      markdownUl: slots?.markdownUl ?? MessageMarkdownUl,
      markdownOl: slots?.markdownOl ?? ChatMessageOl,
      markdownH1: slots?.markdownH1 ?? Typography,
      markdownH2: slots?.markdownH2 ?? Typography,
      markdownH3: slots?.markdownH3 ?? Typography,
      markdownH4: slots?.markdownH4 ?? Typography,
      markdownH5: slots?.markdownH5 ?? Typography,
      markdownH6: slots?.markdownH6 ?? Typography,
      markdownImg: slots?.markdownImg ?? MessageMarkdownImage,
      markdownCodeWrapper: slots?.markdownCodeWrapper ?? MessageMarkdownCodeWrapper,
      markdownCode: slots?.markdownCode ?? MessageMarkdownCode,
      markdownHr: slots?.markdownHr ?? Divider,
      markdownBlockquote: slots?.markdownBlockquote ?? MessageMarkdownBlockquote,
      markdownP: slots?.markdownP ?? Typography,
      messagePagination: slots?.messagePagination ?? MessagePagination,
      messagePaginationRoot: slots?.messagePaginationRoot ?? Stack,
      messagePaginationButton: slots?.messagePaginationButton ?? core.iconButton,
      messagePaginationText: slots?.messagePaginationText ?? Typography,
      messageAssistantFooter: slots?.messageAssistantFooter ?? MockComponent,
      messageAssistantProgress: slots?.messageAssistantProgress ?? MessageAssistantProgress,
      messageAssistantProgressText: slots?.messageAssistantProgressText ?? Typography,
    }

    return {
      slots: componentSlots,
      coreSlots: core,
    };
  }, [slots]);

  const componentSlotProps = React.useMemo(() => ({
    markdownH1: { variant: 'h1' },
    markdownH2: { variant: 'h2' },
    markdownH3: { variant: 'h3' },
    markdownH4: { variant: 'h4' },
    markdownH5: { variant: 'h5' },
    markdownH6: { variant: 'h6' },
    ...slotProps,
  }) as SlotPropsType<DM, DD>, [slotProps])

  return {
    slotProps: componentSlotProps,
    slots: res.slots,
    coreSlots: res.coreSlots
  };
}
