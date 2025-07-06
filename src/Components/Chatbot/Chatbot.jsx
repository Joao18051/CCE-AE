import React, { useState } from 'react';
import { sendChatMessage } from '../../services/api';
import './Chatbot.css';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setLoading(true);
    try {
      const reply = await sendChatMessage(input);
      setMessages(msgs => [...msgs, { from: 'bot', text: reply }]);
    } catch {
      setMessages(msgs => [...msgs, { from: 'bot', text: 'Erro ao acessar o chatbot.' }]);
    }
    setInput('');
    setLoading(false);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chatbot-message ${msg.from}`}>{msg.text}</div>
        ))}
        {loading && <div className="chatbot-message bot">...</div>}
      </div>
      <div className="chatbot-input">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Digite sua mensagem..."
        />
        <button onClick={handleSend} disabled={loading}>Enviar</button>
      </div>
    </div>
  );
} 