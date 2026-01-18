

'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

export default function SendMessagePage() {
  // Defines the page component for sending anonymous messages.
  const params = useParams<{ username: string }>();
  const username = params.username;
  // Gets username from the URL.

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });
// Creates a form with Zod validation.
// z.infer<typeof messageSchema> = TypeScript infers the form fields from schema.

  const messageContent = form.watch('content');
  // Watches the content field → live updates when user types.
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState([]);
  const [showMessages, setShowMessages] = useState(false);

//   isLoading → when sending message.
// isSuggesting → when fetching suggestions.
// suggestedMessages → holds AI/auto-suggested messages.
// showMessages → toggles suggestions panel.

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };
  // When a suggested message is clicked → fills it into textarea.

  const fetchSuggestedMessages = async () => {
    setIsSuggesting(true);
    try {
      const response = await axios.post('/api/suggest-messages');
      if (response.data.success) {
        setSuggestedMessages(response.data.messages);
        //  setShowMessages(true);
        // set all messages in SuggestMessages array
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "Failed to fetch suggestions");
    } finally {
      setIsSuggesting(false);
      setShowMessages(true);
      // setShowMessages will be true in both success of fetchMessgaes
      // if fetchMessgae will be true it will show message
      // if fetchMessage will be false or fails then the suggestion box will appear, but it will be empty (no buttons inside).
    }
  };

//   Calls backend /api/suggest-messages to fetch suggestions.
// Updates state with results, or shows error.

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast.success(response.data.message);
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? 'Failed to send message'
      );
    } finally {
      setIsLoading(false);
    }
  };

//   Handles form submission.
// Sends username + message content to /api/send-message.
// Shows success toast or error toast.
// Resets textarea after success.

  return (
    <div className="bg-gray-900 text-white min-h-screen relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[60vw] h-[60vw] bg-blue-900/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[50vw] h-[50vw] bg-purple-900/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center animate-text-gradient bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Public Profile
        </h1>

        <div className="p-6 bg-gray-800/50 border border-gray-700/60 rounded-2xl backdrop-blur-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">
                      Send Anonymous Message to @{username}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your anonymous message here"
                        className="resize-none bg-gray-900/60 text-gray-100 border border-gray-700 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                {isLoading ? (
                  <Button
                    disabled
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading || !messageContent}
                    // in above line there is no need of writing isLoading as it always will be false because this button shows only when isLoading is false but you can keep it as and also remove it.
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Send It
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
        {/* Renders form with textarea.
        Validates input using Zod.
        Submit button → shows loader and please wait while sending. */}
        {/* when message is sent and is loading or there is no message inside message box then this   disabled={isLoading || !messageContent} line making send it botton disable */}

        <div className="space-y-4 my-10">
          <div className="space-y-2 text-center">
            <Button
              onClick={() => {
                if (suggestedMessages.length === 0) {
                  fetchSuggestedMessages();
                } else {
                  setShowMessages(!showMessages);
                }
              }}
              disabled={isSuggesting}
              className="my-4 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isSuggesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : showMessages ? (
                'Hide Suggestions'
              ) : (
                'Suggest Messages'
              )}
            </Button>
          
          </div>
          {/* // this above block explanation is given at last of file */}
          {!showMessages&&
                   <p className="text-gray-300 flex justify-center items-center">
              Click on suggest to get auto generated messages.
            </p>
          }
   
           {showMessages && (
            
            <Card className="bg-gray-800/50 border border-gray-700/60 text-gray-100 backdrop-blur-sm">
              <CardHeader>
                <h3 className="text-xl font-semibold flex justify-center items-center ">Suggested Messages</h3>
                  <p className="text-gray-300 flex justify-center items-center">
              Click on any message below to select it.
            </p>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                {suggestedMessages.map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    // className="mb-2 border-gray-300 text-gray-300 bg-transparent hover:bg-indigo-600 hover:text-white"
                    className="mb-2 h-auto whitespace-normal border-gray-300 bg-transparent p-4 text-left text-gray-300 hover:bg-indigo-600 hover:text-white"
                    onClick={() => handleMessageClick(message)}
                  >
                    {message}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )} 

{/* {showMessages && (
  <Card className="bg-gray-800/50 border border-gray-700/60 text-gray-100 backdrop-blur-sm max-w-full overflow-hidden">
    <CardHeader>
      <h3 className="text-xl font-semibold">Suggested Messages</h3>
    </CardHeader>
    <CardContent className="flex flex-wrap gap-2">
      {suggestedMessages.map((message, index) => (
        <Button
          key={index}
          variant="outline"
          className="border-gray-300 text-gray-300 bg-transparent 
                     hover:bg-indigo-600 hover:text-white 
                     whitespace-normal break-words px-3 py-2"
          onClick={() => handleMessageClick(message)}
        >
          {message}
        </Button>
      ))}
    </CardContent>
  </Card>
)} */}


          {/* If showMessages is true → shows suggested messages list.
          Clicking a message fills it into form. */}
        </div>

        <Separator className="my-14 bg-gray-700" />
        <div className="text-center text-gray-300">
          <div className="mb-4">Get Your Own Message Board</div>
          <Link href={'/sign-up'}>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Create Your Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}













// Behaviour scenarios (step-by-step)

// Initial state

// suggestedMessages = [], isSuggesting = false, showMessages = false

// Button says "Suggest Messages".

// Click → fetchSuggestedMessages() runs.

// During fetch

// isSuggesting = true → button disabled and text becomes "Generating...".

// After fetch succeeds

// suggestedMessages filled, isSuggesting = false, setShowMessages(true) → suggestions are shown.

// Button now says "Hide Suggestions".

// If user clicks again when suggestions exist

// suggestedMessages.length !== 0 → code runs setShowMessages(!showMessages):

// If currently shown → clicking hides them (button becomes "Suggest Messages" or "Show Suggestions" depending on state).

// If hidden → clicking shows them (no re-fetch).