import * as React from 'react';
import { useChatCoreSlots } from '../core/ChatSlotsContext';
import { useMobile } from '../../ui/Responsive';
import { useLocalizationContext } from '../core/LocalizationContext';
import MdMenu from '../../ui/menu/MdMenu';
import { useChatContext } from '../core/ChatGlobalContext';
import { useThreadContext } from '../thread/ThreadContext';
import { PhotoCameraIcon, FolderIcon, AttachFileIcon } from '../../icons';
import { ChatViewConstants } from '../../views/ChatViewConstants';
import { useSnackbar } from '../hooks/useSnackbar';
import AttachmentModel from '../../models/AttachmentModel';
import { langReplace } from '../../locale/langReplace';
import { Stack } from '@mui/material';

type Props = {
  attachments: AttachmentModel[];
  setAttachments: (a: AttachmentModel[]) => void;
  isTyping?: boolean;
};

const FileAttachmentButton: React.FC<Props> = ({ attachments, setAttachments, isTyping }) => {
  const coreSlots = useChatCoreSlots();
  const { enableFileAttachments, acceptableFileFormat, maxFileSizeBytes, maxFileCount, onFileAttached } = useChatContext();
  const { thread } = useThreadContext();
  const snackbar = useSnackbar();

  const cameraRef = React.useRef<HTMLInputElement>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMobile = useMobile();
  const locale = useLocalizationContext();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isMobile) {
      setAnchorEl(event.currentTarget);
      return;
    }
    fileRef.current?.click();
  };

  const checkType = (file: File, allowedTypes: string[]) => {
    const fileType = file.type;
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();

    return allowedTypes.some((type) => {
      if (type === '*') return true;

      if (type.startsWith('.')) {
        return fileExt === type.toLowerCase();
      }

      if (type.endsWith('/*')) {
        const baseType = type.split('/')[0];
        return fileType.startsWith(baseType + '/');
      }

      return fileType === type;
    });
  }

  const maxCount = maxFileCount || ChatViewConstants.MAX_ATTACHMENTS_IN_MESSAGE;
  const maxSize = maxFileSizeBytes || ChatViewConstants.MAX_ATTACHMENT_SIZE;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = Array.from(event.target.files || []);

    const oversizeFiles = files.filter(f => f.size > maxSize);
    if (oversizeFiles.length > 0) {
      snackbar.show(langReplace(locale.maxFileSizeWarning, { mb: Math.round(maxSize / 1024 / 1024) }));
      files = files.filter(f => f.size <= maxSize);
    }

    const allowedTypes = inputAccept.split(',').map(type => type.trim()).filter(type => type);
    const invalidFiles = files.filter(f => !checkType(f, allowedTypes));

    if (invalidFiles.length > 0) {
      snackbar.show(locale.invalidFileTypeWarning);
      files = files.filter(f => !invalidFiles.includes(f));
    }

    if ((files.length + attachments.length) > maxCount) {
      files = files.slice(0, maxCount - attachments.length);
      snackbar.show(locale.maxAttachmentWarning);
    };

    const fileAttachments = files.map((f) => {
      const isGallery = f.type.startsWith('video') || f.type.startsWith('image');
      return new AttachmentModel(f, isGallery);
    });
    setAttachments([...attachments, ...fileAttachments]);

    if (thread) {
      thread.isLoadingAttachments.value = [...thread.isLoadingAttachments.value, ...fileAttachments.map((f) => f.id)];
      fileAttachments.forEach((file) => {
        const { setProgress, setError, setId, data, id } = file;
        const onFinish = () => {
          file.progress.value = 100;
          thread.isLoadingAttachments.value = thread.isLoadingAttachments.value.filter((a) => a !== id);
        };
        if (onFileAttached) {
          const promise = onFileAttached({ id: file.id, file: data, actions: { setProgress, setError, onFinish, setId } });
          if (promise) promise.then(() => onFinish());
          else {
            onFinish();
          }
        } else {
          onFinish();
        }
      })
    }

    if (fileRef.current?.value) fileRef.current.value = '';
    if (cameraRef.current?.value) cameraRef.current.value = '';
    if (isMobile) setAnchorEl(null);
  };

  const disabled = attachments.length >= ChatViewConstants.MAX_ATTACHMENTS_IN_MESSAGE || isTyping || !thread;
  const inputAccept = React.useMemo(() => {
    if (!acceptableFileFormat) return '*';
    if (Array.isArray(acceptableFileFormat)) {
      return acceptableFileFormat.map((f) => ((f.includes('/') || f.includes('.')) ? f : `${f}/*`)).join(',');
    }
    return acceptableFileFormat;
  }, [acceptableFileFormat]);

  if (!enableFileAttachments) return null;

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      width={48}
      height={40}
      position="relative"
    >
      <coreSlots.iconButton
        disabled={disabled}
        onClick={handleClick}
      >
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
        accept={inputAccept}
        disabled={isTyping}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
    </Stack>
  );
};

export default FileAttachmentButton;
