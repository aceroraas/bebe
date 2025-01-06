import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { subscribeToChat, sendMessage } from '../../shared/services/chatService';
import { useAuth } from '../../shared/hooks/useAuth';
import { useUserRoles } from '../../shared/hooks/useUserRoles';

export default function BabyChat() {
   const [messages, setMessages] = useState([]);
   const { user } = useAuth();
   const { roles, loading: rolesLoading } = useUserRoles(user?.uid);
   const messagesEndRef = useRef(null);

   // Debug logs
   console.log('Current user:', user?.email);
   console.log('User roles:', roles);

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   };

   useEffect(() => {
      const unsubscribe = subscribeToChat((newMessages) => {
         setMessages(newMessages);
      });

      return () => unsubscribe();
   }, []);

   useEffect(() => {
      scrollToBottom();
   }, [messages]);

   const handleSendMessage = async (sender, message) => {
      if (!user) return;
      
      try {
         await sendMessage(sender, message, user.uid);
      } catch (error) {
         console.error('Error al enviar mensaje:', error);
      }
   };

   // Verificar si el usuario es admin usando el role de la colección users
   const isAdmin = roles.includes('admin');
   console.log('Roles array:', roles);
   console.log('Is admin?', isAdmin);

   if (rolesLoading) {
      return (
         <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="loading loading-spinner loading-lg"></div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
         <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 bg-primary text-primary-content">
               <h1 className="text-2xl font-bold text-center">Chat del Bebé</h1>
            </div>

            <div className="flex flex-col h-[600px]">
               {/* Mensajes */}
               <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                     <ChatMessage
                        key={message.id}
                        message={message}
                        isOwnMessage={message.userId === user?.uid}
                     />
                  ))}
                  <div ref={messagesEndRef} />
               </div>

               {/* Input de mensajes (para admins) */}
               {isAdmin ? (
                  <div className="border-t">
                     <ChatInput onSendMessage={handleSendMessage} />
                  </div>
               ) : null}
            </div>
         </div>
      </div>
   );
}