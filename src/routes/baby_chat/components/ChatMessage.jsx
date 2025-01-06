import React from 'react';

const SENDER_STYLES = {
   baby: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      name: 'Bebé',
      emoji: '👶'
   },
   mama: {
      bg: 'bg-pink-100',
      text: 'text-pink-800',
      name: 'Mamá',
      emoji: '👩'
   },
   papa: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      name: 'Papá',
      emoji: '👨'
   }
};

export function ChatMessage({ message, isOwnMessage }) {
   const style = SENDER_STYLES[message.sender];
   const timestamp = message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp);
   
   return (
      <div className={`chat ${isOwnMessage ? 'chat-end' : 'chat-start'}`}>
         <div className="chat-header mb-1">
            <time className="text-xs opacity-50 ml-1">
               {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </time>
         </div>
         <div className={`chat-bubble ${style.bg} ${style.text}`}>
            <span className="font-bold">{style.emoji} {style.name}:</span> {message.message}
         </div>
      </div>
   );
}
