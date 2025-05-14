import * as React from 'react';
import { useChatCoreSlots } from '../../core/ChatSlotsContext';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import MessageAttachmentModel from 'models/MessageAttachmentModel';
import { useObserverValue } from '../../../views/hooks/useObserverValue';
import CircularLoadProgress from './CircularLoadProgress';
import 'photoswipe/style.css';

type Props = {
  image: MessageAttachmentModel;
  galleryId: string;
  handleDelete: (id: number, url: string) => void;
};

const BoxStyled = styled(Box)(() => ({
  position: 'relative',
  height: 64,
  width: 64,
  '& a': {
    height: 'inherit',
    width: 'inherit',
    lineHeight: 0,
    display: 'block',
  },
  '& img': {
    height: 'inherit',
    width: 'inherit',
    objectFit: 'cover',
    aspectRatio: 'auto',
    objectPosition: 'center',
    borderRadius: 16,
  },
}));

const ImagePreviewItem: React.FC<Props> = ({ image, galleryId, handleDelete }) => {
  const coreSlots = useChatCoreSlots();
  const { url, id, getImgSize } = image;
  const progress = useObserverValue(image.progress);
  const size = getImgSize();

  const onDelete = () => {
    handleDelete(id, url);
  };

  return (
    <BoxStyled>
      {(progress && progress < 100) ? <CircularLoadProgress progress={progress || 0} /> : null}
      <a
        key={`${galleryId}-${id}`}
        href={url}
        data-pswp-width={size?.width}
        data-pswp-height={size?.height}
        target="_blank"
        rel="noreferrer"
      >
        <img src={url} alt="" />
      </a>
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

export default ImagePreviewItem;
