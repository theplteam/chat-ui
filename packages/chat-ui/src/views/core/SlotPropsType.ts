import { Thread, type ThreadModel, Message, MessageModel, InternalMessageType } from '../../models';
import * as React from 'react';
import type { LinkProps } from '@mui/material/Link';
import type { TableProps } from '@mui/material/Table';
import type { TableHeadProps } from '@mui/material/TableHead';
import type { TableBodyProps } from '@mui/material/TableBody';
import type { TableCellProps } from '@mui/material/TableCell';
import type { TableRowProps } from '@mui/material/TableRow';
import type { TypographyProps } from '@mui/material/Typography';
import type { MessagePaginationProps } from '../message/MessagePagination';
import type { IconButtonProps } from '@mui/material/IconButton';
import type { StackProps } from '@mui/material/Stack';
import type { BoxProps } from '@mui/material/Box';
import { IdType } from '../../types';

type ChildrenProps = React.PropsWithChildren;

export type SlotPropsType<DM extends Message, DD extends Thread<DM>> = {
  /**
   * Override the full thread component
   */
  thread: { id: string } & ChildrenProps;
  /**
   * Parent for the threads list
   * Will ignored if threadsList slot provided
   */
  listContainer: any;
  /**
   * List of threads
   */
  threadsList: any;
  /**
   * Thread menu button in the threads list
   **/
  threadListItemMenuButton: IconButtonProps & { threadId: IdType; };
  /**
   * Subtitle component for the list container
   */
  listSubtitle: TypographyProps;
  /**
   * Typography component for rendering time text in the threads list (today, last week, last 30 days, etc.)
   */
  listTimeText: TypographyProps;
  /**
   * Driver component for the threads list (mobile version)
   * Will ignored if threadsList slot provided
   */
  listDrawer: ChildrenProps;
  /**
   * Title for the mobile threads list (same as listSubtitle)
   */
  listDrawerTitle: TypographyProps;
  /**
   * Welcome message from the assistant for a new thread or the initial message from the assistant in an existing thread.
   */
  firstMessage: { thread: ThreadModel<DM, DD>, text?: string };

  sendMessageButton: IconButtonProps;

  messageRowInner: { thread: DD } & any;

  // MESSAGE
  /**
   * Render the pagination block for message branches
   */
  messagePagination: MessagePaginationProps;
  /**
   * Root container for message pagination (branches)
   */
  messagePaginationRoot: StackProps;
  /**
   * Typography component for message pagination (branches)
   */
  messagePaginationText: TypographyProps;
  /**
   * IconButton for arrows
   */
  messagePaginationButton: IconButtonProps;
  /**
   * Render some information under the assistant's message.
   */
  messageAssistantFooter: { message: InternalMessageType };
  /**
   * Render the component while sending a request to the chat or while "thinking."
   */
  messageAssistantProgress: BoxProps & { thread: ThreadModel<DM, DD>, message: MessageModel<DM> };
  /**
   * Typography for the component displayed while sending a request to the chat or while "thinking."
   */
  messageAssistantProgressText: TypographyProps;

  // MARKDOWN
  /**
   * Custom markdown renderer
   */
  markdownMessageRoot: BoxProps;
  /**
   * Custom markdown renderer for reasoning block
   */
  markdownReasoningRoot: BoxProps;
  /**
   * Render links
   */
  markdownA: LinkProps;
  /**
   * Render tables (<table>)
   */
  markdownTable: TableProps;
  /**
   * Render table head (<thead>)
   */
  markdownThead: TableHeadProps;
  /**
   * Render table body (<tbody>)
   */
  markdownTbody: TableBodyProps;
  /**
   * Render table row (<tr>)
   */
  markdownTr: TableRowProps;
  /**
   * Render table head cell (<th>)
   */
  markdownTh: TableCellProps;
  /**
   * Render table cell (<td>)
   */
  markdownTd: TableCellProps;
  /**
   * Custom typography for table cells
   */
  markdownTdText: TypographyProps;
  /**
   * Render spans (<span>)
   */
  markdownSpan: TypographyProps;
  /**
   * Render lists (<ul>)
   */
  markdownUl: React.OlHTMLAttributes<HTMLOListElement>;
  /**
   * Render numeric lists (<ol>)
   */
  markdownOl: React.HTMLAttributes<HTMLUListElement>;
  /**
   * Render headers (<h1>)
   */
  markdownH1: TypographyProps;
  /**
   * Render headers (<h2>)
   */
  markdownH2: TypographyProps;
  /**
   * Render headers (<h3>)
   */
  markdownH3: TypographyProps;
  /**
   * Render headers (<h4>)
   */
  markdownH4: TypographyProps;
  /**
   * Render headers (<h5>)
   */
  markdownH5: TypographyProps;
  /**
   * Render headers (<h6>)
   */
  markdownH6: TypographyProps;
  /**
   * Render images (<img>)
   */
  markdownImg: React.JSX.IntrinsicElements['img'];
  /**
   * Render pre (<pre>)
   */
  markdownCodeWrapper: React.JSX.IntrinsicElements['pre'];
  /**
   * Render code (<code>)
   */
  markdownCode: React.JSX.IntrinsicElements['code'];
  /**
   * Render blockquote (<blockquote>)
   */
  markdownBlockquote: React.JSX.IntrinsicElements['blockquote'];
  /**
   * Render paragraphs (<p>)
   */
  markdownP: TypographyProps;
};
