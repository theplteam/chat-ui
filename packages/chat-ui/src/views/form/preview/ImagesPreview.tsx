import * as React from 'react';
import Stack from '@mui/material/Stack';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import MessageAttachmentModel from '../../../models/MessageAttachmentModel';
import ImagePreviewItem from './ImagePreviewItem';
import 'photoswipe/style.css';

type Props = {
  images: MessageAttachmentModel[];
  handleDelete: (id: number, url: string) => void;
};

const ImagesPreview: React.FC<Props> = ({ images, handleDelete }) => {
  const galleryId = 'gallery-preview';
  const lightbox: PhotoSwipeLightbox = React.useMemo(() => new PhotoSwipeLightbox({
    gallery: `#${galleryId}`,
    children: 'a',
    pswpModule: () => import('photoswipe'),
    zoom: false,
    showHideAnimationType: 'fade',
  }), []);

  React.useEffect(() => {
    lightbox.init();

    return () => {
      lightbox?.destroy();
    };
  }, [lightbox]);

  return (
    <Stack
      flexWrap="wrap"
      flexDirection="row"
      gap={1}
      paddingRight="12px"
      className="pswp-gallery"
      id={galleryId}
    >
      {images.map((img, i) => (
        <ImagePreviewItem
          key={i}
          image={img}
          galleryId={galleryId}
          handleDelete={handleDelete}
        />
      ))}
    </Stack>
  );
};

export default ImagesPreview;
