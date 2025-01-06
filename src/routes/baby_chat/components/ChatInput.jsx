import React, { useState } from 'react';

export function ChatInput({ onSendMessage }) {
   const [message, setMessage] = useState('');
   const [sender, setSender] = useState('baby');

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!message.trim()) return;
      
      onSendMessage(sender, message);
      setMessage('');
   };

   return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-lg">
         <div className="flex gap-2">
            <select 
               value={sender}
               onChange={(e) => setSender(e.target.value)}
               className="select select-bordered w-32"
            >
               <option value="baby">👶 Bebé</option>
               <option value="mama">👩 Mamá</option>
               <option value="papa">👨 Papá</option>
            </select>
            
            <input
               type="text"
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               placeholder="Escribe un mensaje..."
               className="input input-bordered flex-1"
            />
            
            <button 
               type="submit" 
               disabled={!message.trim()}
               className="btn btn-primary"
            >
               Enviar
            </button>
         </div>
      </form>
   );
}
