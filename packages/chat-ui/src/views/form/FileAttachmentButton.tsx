import * as React from 'react';
import { useChatCoreSlots } from '../core/ChatSlotsContext';
import { useMobile } from '../../ui/Responsive';
import Stack from '@mui/material/Stack';
import { useLocalizationContext } from '../core/LocalizationContext';
import MdMenu from '../../ui/menu/MdMenu';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useChatContext } from '../core/ChatGlobalContext';
import { useThreadContext } from '../thread/ThreadContext';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FolderIcon from '@mui/icons-material/Folder';
import { ChatViewConstants } from '../../views/ChatViewConstants';
import { useSnackbar } from '../hooks/useSnackbar';
import MessageAttachmentModel from '../../models/MessageAttachmentModel';

type Props = {
  attachments: MessageAttachmentModel[];
  setAttachments: (a: MessageAttachmentModel[]) => void;
  isTyping?: boolean;
};

const FileAttachmentButton: React.FC<Props> = ({ attachments, setAttachments, isTyping }) => {
  const coreSlots = useChatCoreSlots();
  const { enableFileAttachments, acceptableFileFormat, onFileAttached } = useChatContext();
  const { thread } = useThreadContext();
  const snackbar = useSnackbar();

  const cameraRef = React.useRef<HTMLInputElement>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMobile = useMobile();
  const locale = useLocalizationContext();

  if (!enableFileAttachments) return null;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isMobile) {
      setAnchorEl(event.currentTarget);
      return;
    }
    fileRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = Array.from(event.target.files || []);

    if (files.length + attachments.length > ChatViewConstants.MAX_ATTACHMENTS_IN_MESSAGE) {
      files = files.slice(0, ChatViewConstants.MAX_ATTACHMENTS_IN_MESSAGE - attachments.length);
      snackbar.show(locale.maxImageWarning);
    };

    const fileAttachments = files.map((f) => new MessageAttachmentModel(f))
    setAttachments([...attachments, ...fileAttachments]);

    if (thread) {
      thread.isLoadingAttachments.value = [...thread.isLoadingAttachments.value, ...fileAttachments.map((f) => f.id)];
      fileAttachments.forEach((file) => {
        const { setProgress, data, id } = file;
        const onFinish = () => {
          file.progress.value = 100;
          thread.isLoadingAttachments.value = thread.isLoadingAttachments.value.filter((a) => a !== id)
        };
        if (onFileAttached) onFileAttached({ file: data, params: { setProgress, onFinish } })?.then(() => onFinish());
        else onFinish();
      })
    }

    if (fileRef.current?.value) fileRef.current.value = '';
    if (cameraRef.current?.value) cameraRef.current.value = '';
    if (isMobile) setAnchorEl(null);
  };

  const disabled = attachments.length >= ChatViewConstants.MAX_ATTACHMENTS_IN_MESSAGE || isTyping || !thread;

  return (
    <Stack
      alignItems="flex-end"
      width={48}
      height={40}
      position="relative"
    >
      <coreSlots.iconButton disabled={disabled} onClick={handleClick}>
        <AttachFileIcon />
      </coreSlots.iconButton>
      <MdMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={() => setAnchorEl(null)}
      >
        <coreSlots.menuItem
          startIcon={PhotoCameraIcon}
          onClick={() => cameraRef.current?.click()}
        >
          {locale.attachmentImageShot}
        </coreSlots.menuItem>
        <coreSlots.menuItem
          startIcon={FolderIcon}
          onClick={() => fileRef.current?.click()}
        >
          {locale.attachmentImageGallery}
        </coreSlots.menuItem>
      </MdMenu>
      <input
        ref={cameraRef}
        capture="environment"
        type="file"
        accept="image/*,video/*"
        disabled={isTyping}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <input
        ref={fileRef}
        multiple
        type="file"
        accept={acceptableFileFormat || "*"}
        disabled={isTyping}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
    </Stack>
  );
};

export default FileAttachmentButton;
