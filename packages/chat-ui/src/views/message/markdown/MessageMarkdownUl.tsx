import { styled } from '@mui/material/styles';

const MessageMarkdownUl = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  padding: 0,
  '& li': {
    marginBottom: 8,
    '&:last-child': {
      marginBottom: 0,
    },
    ...theme.typography.body1,
    '&::before': {
      content: '""',
      width: 6,
      height: 6,
      margin: '2px 8px',
      display: 'inline-block',
      borderRadius: '50%',
      background: theme.palette.primary.main,
    },
    'ul': {
      marginTop: theme.spacing(1.5),
    }
  },
}));

const ChatMessageOl = styled('ol')(({ theme }) => ({
  padding: '0px 1.625em ',
  '& li': {
    marginBottom: 8,
    '&:last-child': {
      marginBottom: 0,
    },
    ...theme.typography.body1,
    position: 'relative',
    '&::marker': {
      ...theme.typography.body1,
    },
    '& ul': {
      marginTop: theme.spacing(1.5),
    },
  },
}));

export { MessageMarkdownUl, ChatMessageOl };
