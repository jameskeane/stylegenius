import { useState, useCallback } from 'react';
import { AppProvider, Card, TextField, Button} from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import { authenticatedFetch } from "@shopify/app-bridge/utilities";
import { getCSRFToken } from './utils.js';
import styles from './ChatFrame.module.css';



export function ChatFrame() {
  const [messages, setMessages] = useState([
    {'role': 'assistant', 'content': 'Hi, I am your shopping assistant.\nHow can I help you?'},
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const app = useAppBridge();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      // update the chat
      const updatedMessages = [...messages, {'role': 'user', 'content': userMessage}];
      setMessages(updatedMessages);
      setUserMessage('');

      // update openai
      const fetch = authenticatedFetch(app);
      fetch('/api/chat', {
          method: 'POST',
          credentials: "include",
          headers: {
            'X-CSRFToken': getCSRFToken(),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(updatedMessages)
        })
        .then(response => response.json())
        .then((json) => setMessages(json));
    },
    [messages, userMessage, app],
  );

  const handleChange = useCallback(
    (newValue: string) => setUserMessage(newValue),
    [],
  );


  return <div>
    <div className={styles.messages}>
      {
        messages.map((message) => [
          <p className={`message ${styles[message.role]}`}>{message.content}</p>,
          <div style={{clear:'both'}} />
        ])
      }
    </div>

    <form onSubmit={handleSubmit}>
      <TextField
                label="Message"
                type="text"
                value={userMessage}
                onChange={handleChange}
                autoComplete="off"
                connectedRight={<Button type="submit" loading={loading}>Submit</Button>}
              />
    </form>
  </div>;
}
