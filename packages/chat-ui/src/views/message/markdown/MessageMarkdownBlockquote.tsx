import * as React from 'react';
import { styled } from '@mui/material/styles';

type Props = React.JSX.IntrinsicElements['blockquote'];

const BlockquoteStyled = styled('blockquote')(({ theme }) => ({
  margin: 0,
  'p': {
    whiteSpace: 'break-spaces',
    display: 'flex',
    gap: theme.spacing(2),
    '&::before': {
      display: 'inline-block',
      content: '""',
      height: 'inherit',
      width: 2,
      backgroundColor: theme.palette.primary.light,
    }
  },
}))

const MessageMarkdownBlockquote: React.FC<Props> = (props) => {
  return (
    <BlockquoteStyled {...props} />
  );
}

export default MessageMarkdownBlockquote;
