'use client'
import { useToast } from '@/components/ui/use-toast'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { useEffect, useState } from 'react'
import { onGetConversationMode, onToggleRealtime } from '@/actions/conversation'
import { useClerk } from '@clerk/nextjs'
import { useChatContext } from './user-chat-contex'

const useSideBar = () => {
  const [expand, setExpand] = useState<boolean | undefined>(undefined) // State to manage sidebar expansion
  const router = useRouter() // Next.js router for navigation
  const pathname = usePathname() // Get the current pathname
  const { toast } = useToast() // Toast notifications for user feedback
  const [realtime, setRealtime] = useState<boolean>(false) // State to manage real-time chat mode
  const [loading, setLoading] = useState<boolean>(false) // State to manage loading state

  const { chatRoom } = useChatContext() // Access the chat room context

  // Function to activate or deactivate real-time mode
  const onActivateRealtime = async (e: any) => {
    try {
      const realtime = await onToggleRealtime(
        chatRoom!, // Use the current chat room
        e.target.ariaChecked == 'true' ? false : true // Toggle real-time mode based on the switch state
      )
      if (realtime) {
        setRealtime(realtime.chatRoom.live) // Update state with the new real-time status
        toast({
          title: 'Success',
          description: realtime.message, // Show a success message
        })
      }
    } catch (error) {
      console.log(error) // Log any errors to the console
    }
  }

  // Function to get the current conversation mode
  const onGetCurrentMode = async () => {
    setLoading(true) // Set loading state to true
    const mode = await onGetConversationMode(chatRoom!) // Fetch the current conversation mode
    if (mode) {
      setRealtime(mode.live) // Update real-time state
      setLoading(false) // Set loading state to false
    }
  }

  // Effect to fetch the current mode when the chat room changes
  useEffect(() => {
    if (chatRoom) {
      onGetCurrentMode()
    }
  }, [chatRoom])

  const page = pathname.split('/').pop() // Get the current page from the URL
  const { signOut } = useClerk() // Get the sign-out function from Clerk

  const onSignOut = () => signOut(() => router.push('/')) // Sign out the user and redirect to home

  const onExpand = () => setExpand((prev) => !prev) // Toggle sidebar expansion

  return {
    expand, // State and function to control sidebar expansion
    onExpand, // Function to toggle sidebar expansion
    page, // Current page name
    onSignOut, // Function to sign out the user
    realtime, // State and function to control real-time chat mode
    onActivateRealtime, // Function to toggle real-time mode
    chatRoom, // Current chat room from context
    loading, // State to manage loading indicator
  }
}

export default useSideBar
