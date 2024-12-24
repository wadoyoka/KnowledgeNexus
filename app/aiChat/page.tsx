"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "ai/react";
import { Send } from "lucide-react";

export default function Home() {
    const {
        input,
        messages,
        handleInputChange,
        handleSubmit,
    } = useChat({
        api: '/api/chat',
        initialMessages: [
            {
                id: 'welcome',
                role: 'assistant',
                content: 'こんにちは！岩井研について何でも聞いてください！',
            },
        ],
    });

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url("/girl-background.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            /> */}

            <div className="absolute bottom-[70px] left-0 right-0 z-10 h-[calc(50%-70px)] overflow-y-auto p-4">
                <ScrollArea className="h-full">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex items-end mb-4 ${message.role === 'assistant' ? 'justify-start' : 'justify-end'
                                }`}
                        >
                            {message.role === 'assistant' && (
                                <Avatar className="w-8 h-8 mr-2">
                                    <AvatarImage src="/placeholder.svg" alt="AI" />
                                    <AvatarFallback>AI</AvatarFallback>
                                </Avatar>
                            )}
                            <div
                                className={`max-w-[70%] p-3 rounded-2xl ${message.role === 'assistant'
                                        ? 'bg-white text-gray-800 rounded-bl-none'
                                        : 'bg-blue-500 text-white rounded-br-none'
                                    }`}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-white bg-opacity-80">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="メッセージを入力..."
                        className="flex-1 rounded-full border-gray-300 focus:border-blue-400 focus:ring-blue-400"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="rounded-full bg-blue-500 hover:bg-blue-600"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
