"use client";

import LoadingAnimation from '@/components/LoadingAnimation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "ai/react";
import parse, { Element, HTMLReactParserOptions, domToReact } from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';
import { Send } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);

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
        onResponse: () => {
            setIsLoading(false);
        },
    });

    const parseAndSanitize = (content: string) => {
        const sanitizedContent = DOMPurify.sanitize(content);
        const options: HTMLReactParserOptions = {
            replace: (domNode) => {
                if (domNode instanceof Element && domNode.name === 'a' && domNode.attribs) {
                    const href = domNode.attribs.href;
                    return (
                        <a 
                            href={href} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-500 hover:underline"
                        >
                            {domToReact(domNode.children as any)}
                        </a>
                    );
                }
            }
        };
        return parse(sanitizedContent, options);
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        handleSubmit(e);
    };

    return (
        <div className="relative w-full h-[93vh] overflow-hidden bg-slate-200">
            <div className="absolute bottom-[70px] left-0 right-0 z-10 overflow-y-auto p-4">
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
                                {parseAndSanitize(message.content)}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-end mb-4 justify-start">
                            <Avatar className="w-8 h-8 mr-2">
                                <AvatarImage src="/placeholder.svg" alt="AI" />
                                <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                            <div className="bg-white p-3 rounded-2xl rounded-bl-none">
                                <LoadingAnimation />
                            </div>
                        </div>
                    )}
                </ScrollArea>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-white bg-opacity-80">
                <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
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
                        disabled={isLoading}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}

