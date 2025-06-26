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

type ChildrenProps = React.PropsWithChildren;

export type SlotPropsType<DM extends Message, DD extends Thread<DM>> = {
  /**
   * Override the full thread component
   */
  thread: { id: string } & ChildrenProps;
  /**
   * Welcome message from the assistant for a new thread or the initial message from the assistant in an existing thread.
   */
  firstMessage: { thread: ThreadModel<DM, DD>, text?: string };

  sendMessageButton: IconButtonProps;

  messageRowInner: { thread: DD } & any;
  /**
   * Container for attachment preview item.
   */
  attachmentPreviewItem: BoxProps;
  /**
   * Container for attachment preview item with error.
   */
  attachmentPreviewError: BoxProps;

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
  messageAssistantFooter: { message: InternalMessageType, className?: string };
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
  markdownImg: React.JSX.IntrinsicElements['img'] & { rootClassName?: string };
  /**
   * Render pre (<pre>)
   */
  markdownCodeWrapper: React.JSX.IntrinsicElements['pre'];
  /**
   * Render code (<code>)
   */
  markdownCode: React.JSX.IntrinsicElements['code'];
  /**
   * Render code (<hr>)
   */
  markdownHr: any;
  /**
   * Render blockquote (<blockquote>)
   */
  markdownBlockquote: React.JSX.IntrinsicElements['blockquote'];
  /**
   * Render paragraphs (<p>)
   */
  markdownP: TypographyProps;
};

