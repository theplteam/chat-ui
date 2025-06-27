import * as React from 'react';
import MdMenu from '../../../ui/menu/MdMenu';
import { useChatCoreSlots } from '../../../views/core/ChatSlotsContext';
import { SettingsIcon } from '../../../icons';
import { ThreadModel } from '../../../models/ThreadModel';
import { useObserverValue } from '../../../views/hooks/useObserverValue';
import { useChatContext } from '../../../views/core/ChatGlobalContext';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { useMobile } from '../../../ui/Responsive';
import { ToolType } from '../../../types/ToolType';

type ToolsSelectProps = {
  thread?: ThreadModel;
};

const ToolsSelect: React.FC<ToolsSelectProps> = ({ thread }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { enableTools, toolsList } = useChatContext();
  const tool = useObserverValue(thread?.tool);
  const coreSlots = useChatCoreSlots();
  const isMobile = useMobile();

  const handleClose = () => setAnchorEl(null);
  const toggleMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl) {
      handleClose();
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleSelect = (item: ToolType) => {
    if (thread) {
      if (tool?.id === item.id) thread.tool.value = undefined;
      else thread.tool.value = item;
    }
    handleClose();
  };

  if (!enableTools) return null;

  return (
    <Stack direction='row' gap={1} alignItems='center'>
      <div>
        <coreSlots.iconButton onClick={toggleMenu}>
          <SettingsIcon />
        </coreSlots.iconButton>
        <MdMenu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={handleClose}
        >
          {toolsList?.map((item) => (
            <coreSlots.menuItem
              key={item.id}
              startIcon={item.icon}
              selected={item.id === tool?.id}
              onClick={() => handleSelect(item)}
            >
              {item.label}
            </coreSlots.menuItem>
          ))}
        </MdMenu>
      </div>
      {(tool && thread) ? (
        <Chip
          icon={<tool.icon fontSize='small' />}
          label={isMobile ? undefined : tool.smallLabel}
          onDelete={() => thread.tool.value = undefined}
        />
      ) : null}
    </Stack>
  );
}

export default ToolsSelect;
