import * as React from 'react';
import { useChatCoreSlots } from '../../core/ChatSlotsContext';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import MessageAttachmentModel from 'models/MessageAttachmentModel';
import { useObserverValue } from '../../hooks/useObserverValue';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import DescriptionIcon from '@mui/icons-material/Description';
import CircularLoadProgress from './CircularLoadProgress';
import Stack from '@mui/material/Stack';

type Props = {
  file: MessageAttachmentModel;
  handleDelete: (id: number, url: string) => void;
};

const BoxStyled = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 64,
  maxWidth: 200,
  borderRadius: 16,
  backgroundColor: theme.palette.grey[200],
}));

const FilePreviewItem: React.FC<Props> = ({ file, handleDelete }) => {
  const coreSlots = useChatCoreSlots();
  const { url, id, name, type } = file;
  const progress = useObserverValue(file.progress);

  const onDelete = () => {
    handleDelete(id, url);
  };

  const getIcon = () => {
    if (type.startsWith('video')) return <VideoFileIcon color="primary" />
    if (type.startsWith('audio')) return <AudioFileIcon color="primary" />
    if (type.startsWith('text')) return <DescriptionIcon color="primary" />
    return <InsertDriveFileIcon color="primary" />
  }

  return (
    <BoxStyled>
      {(progress && progress < 100) ? <CircularLoadProgress progress={progress || 0} /> : null}
      <Stack
        width='100%'
        height='100%'
        alignItems='center'
        flexDirection="row"
        padding="0 4px"
      >
        {getIcon()}
        <p style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          margin: 0,
          maxWidth: '80%',
        }}
        >
          {name}
        </p>
      </Stack>
      <coreSlots.iconButton
        size='small'
        sx={{
          position: 'absolute',
          padding: 0,
          top: 2,
          right: 2,
          outline: (theme) => `2px solid ${theme.palette.divider}`,
          backgroundColor: (theme) => theme.palette.background.default,
          ":hover": {
            backgroundColor: (theme) => theme.palette.grey[200],
          },
        }}
        onClick={onDelete}
      >
        <CloseIcon sx={{ width: 16, height: 16 }} />
      </coreSlots.iconButton>
    </BoxStyled>
  );
};

export default FilePreviewItem;
