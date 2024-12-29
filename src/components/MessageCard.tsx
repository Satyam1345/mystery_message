'use client'
import React, { useState } from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { Message } from '@/models/User';
import { useToast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import axios from 'axios';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: any) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const { toast } = useToast();
  const [showPopup, setShowPopup] = useState(false);

  const formattedDate = new Date(message.createdAt).toLocaleDateString();
  const formattedTime = new Date(message.createdAt).toLocaleTimeString();

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id);
      setShowPopup(false); // Close the popup after deletion
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="relative border-white rounded-xl border-4 bg-cyan-400">
      <CardHeader>
        <CardTitle className = 'text-2xl text-cyan-900'>{message.content || "Untitled Message"}</CardTitle>
        <CardDescription><div className="text-sm text-gray-100">
            <span>Date: {formattedDate}</span>
          </div>
          <div className="text-sm text-gray-100">
            <span>Time: {formattedTime}</span>
          </div></CardDescription>
        <div className="relative">
          <Button
            variant="destructive"
            onClick={() => setShowPopup(!showPopup)}
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Small Popup */}
          {showPopup && (
            <div className="absolute mt-2 p-3 bg-cyan-400 border border-gray-300 rounded-xl shadow-lg z-50">
              <p className="text-sm mb-2">Are you sure you want to delete this message?</p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className='rounded-xl'
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className='rounded-xl'
                  size="sm"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;
