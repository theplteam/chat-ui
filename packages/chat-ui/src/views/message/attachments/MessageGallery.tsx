import React from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import { IdType } from '../../../types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MessageGalleryItem from './MessageGalleryItem';
import { ImageContent } from '../../../models';
import { base64FileDecode } from '../../../utils/base64File';
import 'photoswipe/style.css';

type Props = {
  id: IdType;
  images: ImageContent[];
};

const GridBox = styled(Box)(() => ({
  ".top-row.left-column": {
    borderTopLeftRadius: '24px',
  },
  ".top-row.right-column": {
    borderTopRightRadius: '24px',
  },
  ".bottom-row.left-column": {
    borderBottomLeftRadius: '24px',
  },
  ".bottom-row.right-column": {
    borderBottomRightRadius: '0px !important',
  },
}));

const MessageGallery = ({ id, images }: Props) => {
  const [items, setItems] = React.useState<HTMLImageElement[]>([]);
  const galleryId = `gallery-${id}`;
  const lightbox: PhotoSwipeLightbox = React.useMemo(() => new PhotoSwipeLightbox({
    gallery: `#${galleryId}`,
    children: 'a',
    pswpModule: () => import('photoswipe'),
    zoom: false,
    showHideAnimationType: 'fade',
  }), [id]);

  React.useEffect(() => {
    lightbox.init();

    return () => {
      lightbox?.destroy();
    };
  }, [lightbox]);

  React.useEffect(() => {
    const imgElements = images.map((i) => {
      const image = new Image();
      if (i?.url) image.src = i.url
      if (i?.base64) {
        const blob = base64FileDecode(i.base64);
        if (blob) image.src = URL.createObjectURL(blob);
      }
      return image;
    })

    setTimeout(() => setItems(imgElements), 100);
  }, [images]);

  const columns = React.useMemo(() => items.length === 4 ? 2 : 3, [items.length]);
  const rows = React.useMemo(() => Math.ceil(items.length / columns), [columns, items.length]);

  return (
    <GridBox
      id={galleryId}
      display="grid"
      mx={1.5}
      gap={1}
      sx={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        direction: 'rtl',
      }}
      overflow="hidden"
      className="pswp-gallery"
    >
      {items.map((item, index) => (
        <MessageGalleryItem
          key={index}
          item={item}
          galleryId={galleryId}
          columns={columns}
          rows={rows}
          itemsCount={items.length}
          index={index}
        />
      ))}
    </GridBox >
  );
}

export default MessageGallery;
