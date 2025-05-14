import * as React from 'react';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';

type Props = {
  progress: number;
  size?: number;
};

const StackStyled = styled(Stack)(() => ({
  position: 'absolute',
  height: '100%',
  width: '100%',
  pointerEvents: 'none',
  backgroundColor: 'transparent',
}));

const CircularLoadProgress: React.FC<Props> = ({ progress, size }) => {
  return (
    <StackStyled justifyContent='center' alignItems='center'>
      <CircularProgress variant="determinate" value={progress} size={size || 40} />
    </StackStyled>
  );
};

export default CircularLoadProgress;
