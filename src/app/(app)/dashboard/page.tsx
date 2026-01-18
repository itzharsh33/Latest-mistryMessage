"use client"

import { Button } from "@/components/ui/button"
import { Message } from "@/model/User"
import { isAcceptingMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import MessageCard from "@/components/MessageCard"

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)



  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(isAcceptingMessageSchema)
  })

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages')



  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }
  

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessages ?? false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description: axiosError.response?.data.message ?? 'Failed to fetch message settings',
      });
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])



  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || []);
      if (refresh) {
        toast("Refreshed Messages", {
          description: "Showing latest messages",
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description: axiosError.response?.data.message ?? 'Failed to fetch messages',
      });
    } finally {
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }, [setIsLoading, setMessages])



  useEffect(() => {
    if (!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
  }, [session, fetchAcceptMessage, fetchMessages])



  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })
     
      setValue('acceptMessages', !acceptMessages)

      toast.success(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description: axiosError.response?.data.message ?? 'Failed to update message settings',
      });
    }
  }



  if (!session || !session.user) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
            <p className="ml-2 text-gray-300">Loading...</p>
        </div>
    )
  }



  const username = session.user.username;
  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
  const profileUrl = `${baseUrl}/u/${username}`


  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success('Profile URL Copied!', {
      description: 'The profile URL has been copied to your clipboard.',
    });
  }

  // Copies profile URL to clipboard and shows a success toast.

  return (
    <div className="relative bg-gray-900 text-white min-h-screen">
      {/* Gradient Background Shapes (same as AboutPage) */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[60vw] h-[60vw] bg-blue-900/30 rounded-full blur-3xl" />
        <div className=" absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[50vw] h-[50vw] bg-purple-900/30 rounded-full blur-3xl" />
      </div>

      <div className=" mx-4 md:mx-8 lg:mx-auto p-6 bg-gray-800/60 border border-gray-700 rounded-2xl w-full max-w-6xl backdrop-blur-sm">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">User Dashboard</h1>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-indigo-400">Copy Your Unique Link</h2>{' '}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-300"
            />
            <Button onClick={copyToClipboard} className="w-full sm:w-auto cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30">
              Copy
            </Button>
          </div>
        </div>

        <div className="mb-4 flex items-center">
          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
            id="accept-messages"
            className="cursor-pointer data-[state=checked]:bg-indigo-600"
          />
         
          <label htmlFor="accept-messages" className="ml-2 text-gray-300">
            Accept Messages: {acceptMessages ? 'On' : 'Off'}
          </label>
        </div>
        <Separator className="bg-gray-700" />
          
        <div className=" flex items-center gap-x-2">
          <span className="text-xl font-bold text-indigo-400">Your Messages</span>
            <Button
          className="mt-4  bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
          ) : (
            <RefreshCcw className="h-4 w-4 text-indigo-400" />
          )}
        </Button>
        {/* Refresh button triggers fetchMessages(true); if isLoading show spinner else show refresh icon. */}
        </div>
    
      

        <div className=" mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 ">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard 
               
                key={message._id as string}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p className="text-gray-400">No messages to display.</p>
          )}
        </div>
      </div>
    
    
    </div>
      
  )
}

export default Page











