import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { UnfoldLessIcon, UnfoldMoreIcon } from '../../icons';
import { useLocalizationContext } from '../core/LocalizationContext';
import { useChatCoreSlots } from '../core/ChatSlotsContext';
import { motion } from '../../utils/materialDesign/motion';

type Props = {
  expand: boolean,
  show: boolean,
  onClick: () => void,
};

const DivStyled = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 4,
  right: 4,
  transition: theme.transitions.create('opacity', { duration: motion.duration.short4 }),
}));

const TextFieldExpandButton: React.FC<Props> = ({ expand, onClick, show }) => {
  const locale = useLocalizationContext();
  const coreSlots = useChatCoreSlots();

  return (
    <DivStyled style={{ opacity: show ? 1 : 0 }}>
      <Tooltip title={locale.innerRowExpand}>
        <coreSlots.iconButton sx={{ transform: 'rotate(45deg)', width: '48px', height: '48px' }} disabled={!show} onClick={onClick}>
          {expand ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
        </coreSlots.iconButton>
      </Tooltip>
    </DivStyled>
  );
};

export default TextFieldExpandButton;
