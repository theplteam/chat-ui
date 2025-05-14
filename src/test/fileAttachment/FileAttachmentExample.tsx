import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import { randomInt } from "../../../packages/chat-ui/src/utils/numberUtils/randomInt";
import { FileAttachmentParams } from "../../../packages/chat-ui/src/models/FileAttachmentParams";

const FileAttachmentExample: React.FC = () => {
  const [threads] = React.useState<Thread[]>(
    [
      {
        id: "1",
        title: "Base syntax",
        messages: [
          {
            content: [
              {
                type: 'text',
                text: "Img",
              },
              {
                type: 'image',
                url: 'https://i.pinimg.com/564x/01/30/8c/01308cb758292a1c89570062c7736230.jpg'
              },
              {
                type: 'image',
                url: 'https://i.pinimg.com/564x/01/30/8c/01308cb758292a1c89570062c7736230.jpg'
              },
            ],
            role: "user",
          },
          {
            content: "Ans",
            role: "assistant",
          },
          {
            content: [
              {
                type: 'text',
                text: "File",
              },
              {
                type: 'file',
                base64: 'filename=example.txt;data:text/plain;base64,ZXhhbXBsZQ==',
              },
              {
                type: 'file',
                base64: 'filename=example.txt;data:text/plain;base64,ZXhhbXBsZQ==',
              },
              {
                type: 'file',
                base64: 'filename=exampleLooooooooooooooooooooooooooooooong.txt;data:text/plain;base64,ZXhhbXBsZQ==',
              },
              {
                type: 'file',
                base64: 'filename=example.txt;data:text/plain;base64,ZXhhbXBsZQ==',
              },
              {
                type: 'file',
                base64: 'filename=example.txt;data:text/plain;base64,ZXhhbXBsZQ==',
              },
              {
                type: 'file',
                base64: 'filename=example.txt;data:text/plain;base64,ZXhhbXBsZQ==',
              },
            ],
            role: "user",
          },
          {
            content: "Ans",
            role: "assistant",
          },
          {
            content: [
              {
                type: 'text',
                text: "File + Img",
              },
              {
                type: 'file',
                base64: 'filename=example.txt;data:text/plain;base64,ZXhhbXBsZQ==',
              },
              {
                type: 'image',
                url: 'https://i.pinimg.com/564x/01/30/8c/01308cb758292a1c89570062c7736230.jpg'
              },
              {
                type: 'image',
                url: 'https://i.pinimg.com/564x/01/30/8c/01308cb758292a1c89570062c7736230.jpg'
              },
            ],
            role: "user",
          },
          {
            content: "Ans",
            role: "assistant",
          },
        ],
        "date": "2024-11-16 08:07:54"
      }
    ]
  );

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  const onFileAttached = async ({ params }: FileAttachmentParams) => {
    let progress = 0;
    const { setProgress } = params;

    const uploadSimulation = new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (progress < 100) {
          progress += randomInt(1, 10);
          setProgress(progress);
        } else {
          clearInterval(interval);
          resolve();
        };
      }, 300);
    });

    await uploadSimulation;
  };

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        enableFileAttachments
        thread={threads[0]}
        threads={threads}
        handleStopMessageStreaming={handleStopMessageStreaming}
        onUserMessageSent={onUserMessageSent}
        onFileAttached={onFileAttached}
      />
    </Box>
  );
}

export default FileAttachmentExample;
