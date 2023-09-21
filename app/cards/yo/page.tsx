// ./app/page.js
'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({ api: '/api/cards/verify' });

  return (
    <div>
      {messages.map(m => (
        <div key={m.id} className="p-5">
          {m.role}: {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          className="text-white bg-black m-5"
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
