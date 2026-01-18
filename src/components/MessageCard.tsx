

"use client"
import { X } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button" // Corrected import
import { Message } from "@/model/User"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"
import { format } from 'date-fns';

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}


const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
            toast.success(response.data.message);
           
            onMessageDelete(message._id as string);
           
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? "Failed to delete message");
        }
    }

    return (
       <Card className="card-bordered bg-slate-200">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>{message.content}</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                                <X className='w-5 h-5'/>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div className="text-sm text-gray-500">
                    {format(new Date(message.createdAt), 'PPpp')}
                </div>
            </CardHeader>
            <CardContent></CardContent>
        </Card>
    )
}

export default MessageCard


