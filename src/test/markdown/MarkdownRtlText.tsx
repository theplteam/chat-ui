import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

const markdownString = `
# כותרת רמה 1 
            
## כותרת רמה 2

### כותרת רמה 3

#### כותרת רמה 4

##### כותרת רמה 5

###### כותרת רמה 6

**מודגש**

*נטוי*

[קישור](https://docs.playliner.com/)

רשימות מסודרות:

1. פריט ראשון
2. פריט שני
3. פריט שלישי

רשימות לא מסודרות:

- פריט ראשון
- פריט שני
- פריט שלישי

דוגמה לבלוק קוד:

\`\`\`jsx
import React from 'react';

const App = () => {
  return <div>!שלום, עולם</div>
};

export default App;
\`\`\`

ציטוט:

> שורה 1
> שורה 2
> שורה 3

דוגמה לטבלה:

| שם  | גיל | עיר          |
|-------|-----|---------------|
| אליס | 30  | ניו יורק      |
| בוב   | 25  | לונדון        |
| קרול | 35  | סן פרנסיסקו |
`;

const MarkdownRtlText: React.FC = () => {
  const [threads] = React.useState<Thread[]>(
    [
      {
        id: "1",
        title: "Attachment",
        messages: [
          {
            id: '1',
            role: "user",
            content: "Hello, can you respond to me in Hebrew?",
          },
          {
            id: '2',
            role: "assistant",
            content: "שלום, כמובן שכן.",
          },
          {
            id: '3',
            role: "user",
            content: "הראה איך נראים מרקדאונים בעברית",
          },
          {
            id: '4',
            parentId: '3',
            content: markdownString,
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
        initialThread={threads[0]}
        threads={threads}
        handleStopMessageStreaming={handleStopMessageStreaming}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default MarkdownRtlText;
