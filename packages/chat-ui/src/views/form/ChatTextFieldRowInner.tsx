import * as React from 'react';
import { styled } from '@mui/material/styles';
import ChatTextField from './ChatTextField';
import Stack from '@mui/material/Stack';
import { inputBaseClasses } from '@mui/material/InputBase';
import { useObserverValue } from '../hooks/useObserverValue';
import { ThreadModel } from '../../models/ThreadModel';
import { materialDesignSysPalette } from '../../utils/materialDesign/palette';
import { motion } from '../../utils/materialDesign/motion';
import { useChatContext } from '../core/ChatGlobalContext';
import { Message } from '../../models';
import AttachmentModel from '../../models/AttachmentModel';
import AttachmentsPreview from './preview/AttachmentsPreview';
import attachmentsStore from '../../models/AttachmentsStore';
import RowInnerFooter from './RowInnerFooter';

type Props = {
  thread?: ThreadModel;
};

const StackStyled = styled(Stack)(({ theme }) => ({
  outline: `1px solid ${materialDesignSysPalette.outlineVariant}`,
  borderRadius: 24,
  padding: theme.spacing(1),
  transition: theme.transitions.create(
    ['border-radius', 'outline'], { duration: motion.duration.short2 }),
  [`&:has(.${inputBaseClasses.focused})`]: {
    outline: `2px solid ${materialDesignSysPalette.primary}`,
  },
}));

const ChatTextFieldRowInner: React.FC<Props> = ({ thread }) => {
  const { defaultTextFieldValue, apiRef } = useChatContext();

  const isTyping = useObserverValue(thread?.isTyping);
  const isLoadingAttachments = useObserverValue(thread?.isLoadingAttachments);
  const isLoadingFullData = useObserverValue(thread?.isLoadingFullData);

  const [text, setText] = React.useState(defaultTextFieldValue ?? '');
  const [attachments, setAttachments] = React.useState<AttachmentModel[]>([]);

  const onSendMessage = () => {
    if (isLoadingAttachments?.length) return;
    let content: Message['content'] = text;
    if (attachments.length) {
      attachmentsStore.items.push(...attachments.filter((a) => !a.error.value));
      content = attachments.map((a) => a.contentData);
      if (text) {
        content = [
          { type: 'text', text },
          ...content,
        ];
      }
    };

    apiRef.current?.sendUserMessage(content, thread?.tool.value);
    setText('');

    setAttachments([]);
  }

  const disabledTextField = !thread || isTyping || isLoadingFullData;
  const disabledButton = (!isTyping && !text && !attachments.length) || !!isLoadingAttachments?.length || isLoadingFullData;

  const previewComponent = React.useMemo(() => (
    <AttachmentsPreview attachments={attachments} setAttachments={setAttachments} thread={thread} />
  ), [attachments, thread]);

  return (
    <StackStyled gap={attachments.length ? 1 : 0}>
      {previewComponent}
      <ChatTextField
        text={text}
        setText={setText}
        disabled={disabledTextField}
        onSendMessage={onSendMessage}
      />
      <RowInnerFooter
        thread={thread}
        attachments={attachments}
        setAttachments={setAttachments}
        isTyping={isTyping}
        disabledSendMessage={disabledButton}
        onSendMessage={onSendMessage}
      />
    </StackStyled>
  );
};

export default ChatTextFieldRowInner;
