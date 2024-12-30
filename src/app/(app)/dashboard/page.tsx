'use client';
import MessageCard from "@/components/MessageCard";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message, User } from "@/models/User";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import * as Switch from '@radix-ui/react-switch';


const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false); // when fetching messages
  const [isSwitchLoading, setIsSwithcLoading] = useState(false);

  const { toast } = useToast();

  // Optimistic UI, show immediate changes on UI to the user, will update backend later
  const handleDeleteMessage = (messageId: string) => {
    setMessages(
      messages.filter((message) => message._id !== messageId)  // Add return statement or ensure expression returns a boolean
    );
    
  };
  

  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptmessage = useCallback(async () => {
    setIsSwithcLoading(true);
    try {
      const response = await axios.get("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwithcLoading(false);
    }
  }, [setValue , toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwithcLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing Latest Messages",
          });
        }
        console.log("Fetched Messages:", response.data.messages);
        // console.log("User ID:", userId);
        // console.log("Aggregation Result:", user);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ||
            "Failed to fetch message settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwithcLoading(false);
      }
    },
    [setIsLoading, setMessages , toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptmessage();
  }, [session, setValue, fetchMessages, fetchAcceptmessage]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    }
  };
  const [baseUrl, setBaseUrl] = useState("");

useEffect(() => {
  if (typeof window !== "undefined") {
    setBaseUrl(`${window.location.protocol}//${window.location.host}`);
  }
}, []);


  const username = (session?.user as User)?.username || "Guest";
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL copied",
      description: "Profile URL has been copied to clipboard",
    });
  };

  if (!session || !session.user) {
    return <div>Please Login</div>;
  }

  return (
    <>
    <Navbar/>
      <div className= {`my-8 md:mx-8 lg:mx-auto p-6 rounded-3xl w-full max-w-6xl transition-all duration-500 ${
    acceptMessages
      ? 'bg-gradient-to-r from-blue-300 to-blue-600'
      : 'bg-gradient-to-r from-blue-600 to-blue-300'
  }`}>
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
          <div className="flex items-center">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="input input-bordered rounded=xl w-80 p-2 mr-2"
            />
            <Button  className='border-white rounded-xl border-2' onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>

        <div className="mb-4">
        <Switch
  className={`z-10 h-6 w-11 items-center rounded-full border-2 shadow-inner border-white ${
    acceptMessages ? 'bg-green-500' : 'bg-black'
  }`}
  {...register('acceptMessages')}
  checked={acceptMessages}
  onCheckedChange={handleSwitchChange}
  disabled={isSwitchLoading}
/>

          <span className="ml-2 font-semibold">
            Accept Messages : {acceptMessages ? "On" : "Off"}
          </span>
        </div>
        <Separator />

        <div className="flex flex-row gap-x-4">
        <Button
          className="mt-4 border-white border-2 rounded-2xl"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
        <div className="mt-6 text-pretty font-semibold">
          Fetch Messages
        </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id as string}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
