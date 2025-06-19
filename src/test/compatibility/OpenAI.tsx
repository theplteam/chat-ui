import * as React from "react";
import {
  ChatGptAdapter,
  ChatPage,
  Thread,
  useAssistantAnswerMock,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

const helloMessage = `Hello! I am your AI assistant, and I’m ready to help you with any questions or tasks.

Feel free to ask – together we’ll find the best solutions!`;

const threads = [
  {
    "id": "test-id",
    "title": "Pleasant conversation",
    "messages": [
      {
        "id": "1",
        "role": "user",
        "content": "Hello!",
        "created": 1677652281
      },
      {
        "id": "chatcmpl-123",
        "object": "chat.completion",
        "created": 1677652282,
        "model": "gpt-4o-mini",
        "system_fingerprint": "fp_44709d6fcb",
        "choices": [{
          "index": 0,
          "message": {
            "role": "assistant",
            "content": "\n\nHello there, how may I assist you today?"
          },
          "logprobs": null,
          "finish_reason": "stop"
        }],
        "service_tier": "default",
        "usage": {
          "prompt_tokens": 9,
          "completion_tokens": 12,
          "total_tokens": 21,
          "completion_tokens_details": {
            "reasoning_tokens": 0,
            "accepted_prediction_tokens": 0,
            "rejected_prediction_tokens": 0
          }
        }
      },
      {
        "id": "2",
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Say that I am handsome."
          }
        ],
        "created": 1677652283
      },
      {
        "id": "chatcmpl-124",
        "object": "chat.completion",
        "created": 1677652284,
        "model": "gpt-4o-mini",
        "system_fingerprint": "fp_44709d6fcb",
        "choices": [{
          "index": 0,
          "message": {
            "role": "assistant",
            "content": "\n\nYou are handsome!"
          },
          "logprobs": null,
          "finish_reason": "stop"
        }],
        "service_tier": "default",
        "usage": {
          "prompt_tokens": 9,
          "completion_tokens": 12,
          "total_tokens": 21,
          "completion_tokens_details": {
            "reasoning_tokens": 0,
            "accepted_prediction_tokens": 0,
            "rejected_prediction_tokens": 0
          }
        }
      }
    ]
  }
];

const App: React.FC = () => {
  const dd = threads as Thread[];

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  const initialThreadMessage = () => {
    const message = {
      text: helloMessage,
      stream: false,
    };
    return message;
  };

  return (
    <Box height="100dvh" width="100dvw">
      <ChatGptAdapter>
        <ChatPage
          initialThread={dd[0]}
          threads={dd}
          handleStopMessageStreaming={handleStopMessageStreaming}
          initialThreadMessage={initialThreadMessage}
          onUserMessageSent={onUserMessageSent}
        />
      </ChatGptAdapter>
    </Box>
  );
}

export default App;
