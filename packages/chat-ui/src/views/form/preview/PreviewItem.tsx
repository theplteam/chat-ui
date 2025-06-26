import React from 'react';
import { styled } from '@mui/material/styles';
import AttachmentModel from '../../../models/AttachmentModel';
import { useObserverValue } from '../../hooks/useObserverValue';
import CircularLoadProgress from './CircularLoadProgress';
import PreviewDeleteButton from './PreviewDeleteButton';
import FileItem from './FileItem';
import GalleryItem from './GalleryItem';
import { useElementRefState } from '../../../views/hooks/useElementRef';
import { useMobile } from '../../../ui/Responsive';
import useHover from '../../../views/hooks/useHover';
import { IdType } from '../../../types';
import PreviewTooltip from './PreviewTooltip';
import { useChatSlots } from '../../../views/core/ChatSlotsContext';

type Props = {
  item: AttachmentModel;
  galleryId: string;
  handleDelete: (id: IdType, url: string) => void;
};

const TooltipStyled = styled(PreviewTooltip)(() => ({
  '& a': {
    height: 80,
    width: 80,
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

const PreviewItem: React.FC<Props> = ({ item, galleryId, handleDelete }) => {
  const { url, id, name, type, isGallery } = item;
  const { slots, slotProps } = useChatSlots();

  const progress = useObserverValue(item.progress);
  const error = useObserverValue(item.error);
  const poster = useObserverValue(item.poster);

  const { element, setElement } = useElementRefState();
  const isHover = useHover(element);
  const isMobile = useMobile();

  const isVideo = type === 'video';
  const showInGallery = isGallery && !error;

  const component = React.useMemo(() => ({
    wrapper: error ? slots.attachmentPreviewError : slots.attachmentPreviewItem,
    props: error ? slotProps.attachmentPreviewError : slotProps.attachmentPreviewItem
  }), [error]);

  return (
    <TooltipStyled title={name}>
      <component.wrapper
        {...component.props}
        ref={setElement}
        position='relative'
        height={80}
        borderRadius={4}
        width={showInGallery ? 80 : 200}
      >
        {(!progress || progress < 100) ? <CircularLoadProgress progress={progress} /> : null}
        {showInGallery
          ? (
            <GalleryItem
              id={`${galleryId}-${id}`}
              poster={poster}
              videoUrl={isVideo ? url : undefined}
              showPlayIcon={isVideo}
            />
          ) : <FileItem name={name} type={type} error={error} />}
        {(isMobile || isHover) ? <PreviewDeleteButton onClick={() => handleDelete(id, url)} /> : null}
      </component.wrapper>
    </TooltipStyled>
  );
};

export default PreviewItem;
