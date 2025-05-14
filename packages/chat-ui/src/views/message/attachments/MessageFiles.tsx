import React from 'react';
import { FileContent } from '../../../models';
import Stack from '@mui/material/Stack';
import { base64FileDecode } from '../../../utils/base64File';
import { isDefined } from '../../../utils/isDefined';
import { styled } from '@mui/material/styles';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import DescriptionIcon from '@mui/icons-material/Description';

type Props = {
  files: FileContent[];
};

const StackStyled = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  height: 64,
  width: 120,
  borderRadius: 16,
  padding: "0 16px",
}));

const MessageFiles = ({ files }: Props) => {
  const [items, setItems] = React.useState<File[]>([]);

  const getIcon = (type: string) => {
    if (type.startsWith('video')) return <VideoFileIcon color="primary" />
    if (type.startsWith('audio')) return <AudioFileIcon color="primary" />
    if (type.startsWith('text')) return <DescriptionIcon color="primary" />
    return <InsertDriveFileIcon color="primary" />
  }

  React.useEffect(() => {
    const getFiles = async () => {
      const formattedFiles = await Promise.all(files.map(async (f, idx) => {
        if (f?.url) {
          try {
            const response = await fetch(f.url);
            const blob = await response.blob();
            const name = f.url.split('/').pop() || `file_${idx}`;
            return new File([blob], name, { type: blob.type });
          } catch {
            return null;
          }
        }
        if (f?.base64) {
          return base64FileDecode(f.base64);
        }
        return null;
      }));
      setItems(formattedFiles.filter(isDefined));
    };

    getFiles();
  }, [files]);

  const ellipsisFileName = (name: string) => {
    if (name.length <= 16) return name;
    const split = name.split('.');
    const end = split[0].slice(-3);
    const start = split[0].slice(0, 5);
    return `${start}...${end}.${split[1]}`;
  }

  return (
    <Stack
      mx={1.5}
      gap={1}
      overflow="hidden"
      flexWrap="wrap"
      flexDirection="row"
      justifyContent="end"
    >
      {items.map(({ name, type }, index) => (
        <StackStyled
          key={index} gap={1} justifyContent='center'
          alignItems="end"
        >
          <p style={{ margin: 0 }}>
            {ellipsisFileName(name)}
          </p>
          <Stack flexDirection="row" alignItems='center' gap={1}>
            {name.split('.')[1].toUpperCase()}
            {getIcon(type)}
          </Stack>
        </StackStyled>
      ))}
    </Stack >
  );
}

export default MessageFiles;
