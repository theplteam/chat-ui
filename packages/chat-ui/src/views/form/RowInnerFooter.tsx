import * as React from 'react';
import Stack from '@mui/material/Stack';
import ToolsSelect from './tools/ToolsSelect';
import FileAttachmentButton from './FileAttachmentButton';
import AttachmentModel from '../../models/AttachmentModel';
import { ThreadModel } from '../../models/ThreadModel';
import SendMessageButton from './SendMessageButton';

type Props = {
  thread?: ThreadModel;
  isTyping?: boolean;

  attachments: AttachmentModel[];
  setAttachments: (a: AttachmentModel[]) => void;

  onSendMessage: () => void;
  disabledSendMessage?: boolean;
};

const RowInnerFooter: React.FC<Props> = ({ attachments, setAttachments, onSendMessage, thread, isTyping, disabledSendMessage }) => {

  return (
    <Stack direction='row' justifyContent='space-between' alignItems='center'>
      <Stack direction='row' alignItems='center'>
        <FileAttachmentButton
          attachments={attachments}
          setAttachments={setAttachments}
          isTyping={isTyping}
        />
        <ToolsSelect thread={thread} />
      </Stack>
      <SendMessageButton
        disabled={disabledSendMessage}
        isTyping={isTyping}
        onSendMessage={onSendMessage}
      />
    </Stack>
  );
};

export default RowInnerFooter;
