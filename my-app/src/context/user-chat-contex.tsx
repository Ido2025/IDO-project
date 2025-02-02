'use client'

import { createContext, useContext, useState } from 'react'

// Define the types for the chat context state
type ChatInitialValuesProps = {
  realtime: boolean  // Boolean to check if real-time updates are enabled
  setRealtime: React.Dispatch<React.SetStateAction<boolean>>  // Function to update 'realtime'
  chatRoom: string | undefined  // Chat room identifier
  setChatRoom: React.Dispatch<React.SetStateAction<string | undefined>>  // Function to update 'chatRoom'
  chats: {
    message: string  // Message content
    id: string  // Unique identifier for the message
    role: 'assistant' | 'user' | null  // Role of the message sender (assistant or user)
    createdAt: Date  // Date when the message was created
    seen: boolean  // Boolean to check if the message has been seen
  }[]
  setChats: React.Dispatch<
    React.SetStateAction<
      {
        message: string
        id: string
        role: 'assistant' | 'user' | null
        createdAt: Date
        seen: boolean
      }[]
    >
  >  // Function to update the chats array
  loading: boolean  // Boolean to check if a loading state is active
  setLoading: React.Dispatch<React.SetStateAction<boolean>>  // Function to update 'loading'
}

// Initial values for the chat context state
const ChatInitialValues: ChatInitialValuesProps = {
  chatRoom: undefined,  // No chat room is selected by default
  setChatRoom: () => undefined,  // Default setter does nothing
  chats: [],  // Empty chat array as initial state
  setChats: () => undefined,  // Default setter does nothing
  loading: false,  // Loading is false by default
  setLoading: () => undefined,  // Default setter does nothing
  realtime: false,  // Real-time updates are off by default
  setRealtime: () => undefined,  // Default setter does nothing
}

// Create a context for the chat state
const chatContext = createContext(ChatInitialValues)
const { Provider } = chatContext  // Extract the Provider component from the context

// ChatProvider component to wrap children components and provide chat context
export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  // Define state variables and their setters using the initial values
  const [chats, setChats] = useState(ChatInitialValues.chats)
  const [loading, setLoading] = useState(ChatInitialValues.loading)
  const [chatRoom, setChatRoom] = useState(ChatInitialValues.chatRoom)
  const [realtime, setRealtime] = useState(ChatInitialValues.realtime)

  // Object containing the state and setters to be passed to the Provider
  const values = {
    chats,
    setChats,
    loading,
    setLoading,
    chatRoom,
    setChatRoom,
    realtime,
    setRealtime,
  }

  // Return the Provider component with the chat context values, wrapping children components
  return <Provider value={values}>{children}</Provider>
}

// Custom hook to use the chat context in other components
export const useChatContext = () => {
  const state = useContext(chatContext)  // Get the current context value
  return state  // Return the context value
}
