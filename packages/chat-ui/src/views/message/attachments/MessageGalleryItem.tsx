import React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

type Props = {
  item: HTMLImageElement;
  galleryId: string;
  columns: number;
  rows: number;
  itemsCount: number;
  index: number;
};

const GridItem = styled(Box)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.common.white,
  position: 'relative',
  borderRadius: '8px',
  '& a': {
    width: '100%',
    height: '100%',
    lineHeight: 0,
    display: 'block',
  },
  '& img': {
    height: '100%',
    width: "inherit",
    objectFit: 'cover',
    aspectRatio: 'auto',
    objectPosition: 'center',
    borderRadius: '8px',
  },
}));

const MessageGalleryItem = ({ item, galleryId, columns, rows, itemsCount, index }: Props) => {
  const { src, width, height } = item;

  const getItemsInRow = (row: number) => {
    const startIndex = row * columns;
    const endIndex = Math.min(startIndex + columns, itemsCount);
    return endIndex - startIndex;
  };

  const size = React.useMemo(() => {
    if (itemsCount === 1) return 256;
    if (itemsCount >= 2 && itemsCount <= 6) return 128;
    return 64;
  }, [itemsCount]);

  const getClassName = () => {
    if (itemsCount === 1) return '';

    const row = Math.floor(index / columns);
    const itemsInRow = getItemsInRow(row);
    const col = index % columns;
    const isTopRow = row === 0;
    const isBottomRow = row === rows - 1;
    const isRightColumn = col === 0;
    const isLeftColumn = (col === columns - 1) || itemsInRow < 3 && !isRightColumn;
    const isLastAndSingle = isRightColumn && itemsInRow === 1 && isBottomRow;

    const className = `
      ${isTopRow ? 'top-row' : ''} 
      ${isBottomRow ? 'bottom-row' : ''} 
      ${isLeftColumn ? 'left-column' : ''} 
      ${isRightColumn ? 'right-column' : ''}
      ${isTopRow && itemsCount > 4 && itemsCount < 6 ? 'bottom-row' : ''}
      ${!isTopRow && !isBottomRow && itemsCount > 6 && itemsCount < 9 && !isRightColumn ? 'bottom-row' : ''}
      ${rows > 3 && index === 8 ? 'bottom-row' : ''}
      ${rows === 1 && isLeftColumn ? 'bottom-row' : ''}
      ${isLastAndSingle ? 'left-column' : ''}
    `;

    return className;
  };

  const className = getClassName();

  return (
    <GridItem
      key={index}
      sx={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      className={className}
    >
      <a
        key={`${galleryId}-${index}`}
        href={src}
        data-pswp-width={width}
        data-pswp-height={height}
        target="_blank"
        rel="noreferrer"
      >
        <img src={src} alt={`image-${index}`} className={className} />
      </a>
    </GridItem>
  );
}

export default MessageGalleryItem;
