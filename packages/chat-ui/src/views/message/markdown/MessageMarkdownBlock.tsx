import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';
import MessageMarkdown from './MessageMarkdown';
import { SlotValue } from '../../core/usePropsSlots';
import clsx from 'clsx';
import { chatClassNames } from '../../core/chatClassNames';

type Props = {
  text: string;
  id?: string;
  rootComponent: SlotValue<BoxProps>;
  rootComponentProps: BoxProps | undefined;
  inProgress: boolean;
};

export const ChatMarkdownBlockRoot = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  width: '100%',
  wordWrap: 'break-word',
  '& ol, p, ul': {
    margin: 0,
  },
  '& div:first-child': {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  '& code': {
    whiteSpace: 'pre-line',
  },
  '& table': {
    borderCollapse: 'collapse',
  },
}));

const MessageMarkdownBlock: React.FC<Props> = ({ text, id, inProgress, ...otherProps }) => {
  return (
    <otherProps.rootComponent
      {...otherProps.rootComponentProps}
      className={clsx(otherProps.rootComponentProps?.className, chatClassNames.markdownParentRoot)}
      id={id}
    >
      <MessageMarkdown inProgress={inProgress} text={text} />
    </otherProps.rootComponent>
  );
}

export default MessageMarkdownBlock;
