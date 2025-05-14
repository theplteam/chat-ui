import * as React from 'react';
import Stack from '@mui/material/Stack';
import MessageAttachmentModel from '../../../models/MessageAttachmentModel';
import FilePreviewItem from './FilePreviewItem';

type Props = {
  files: MessageAttachmentModel[];
  handleDelete: (id: number, url: string) => void;
};

const FilesPreview: React.FC<Props> = ({ files, handleDelete }) => {

  return (
    <Stack
      flexDirection="row"
      flexWrap="wrap"
      gap={1}
      paddingRight="12px"
    >
      {files.map((file, i) => (
        <FilePreviewItem
          key={i}
          file={file}
          handleDelete={handleDelete}
        />
      ))}
    </Stack>
  );
};

export default FilesPreview;
