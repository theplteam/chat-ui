import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import { toolsList } from "./toolsList";

const assistantAnswer = `
Hello, you can add your own tools by adding them to the chat component. They will appear in the corresponding menu.

This chat has the following set:
- Create an image
- Search the web
- Write text or code
- Run deep research
- Think more
`;

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>(
    [
      {
        id: "1",
        title: "Tools",
        messages: [
          {
            id: '1',
            content: 'Hello, I have tools for improved model behavior management. How do I use them?',
            role: "user",
          },
          {
            id: '2',
            parentId: '1',
            content: assistantAnswer,
            role: "assistant",
          },
        ],
        "date": "2024-11-16 08:07:54"
      }
    ]
  );

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        enableTools
        toolsList={toolsList}
        initialThread={threads[0]}
        threads={threads}
        handleStopMessageStreaming={handleStopMessageStreaming}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default App;
