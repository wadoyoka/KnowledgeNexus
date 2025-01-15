"use client";

import '@/app/styles/turnBack.css';
import LoadingAnimation from '@/components/LoadingAnimation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useChat } from "ai/react";
import parse, { DOMNode, Element, HTMLReactParserOptions, domToReact } from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';
import { Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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

    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Add a small delay to ensure content is rendered
        const timeoutId = setTimeout(() => {
            if (scrollAreaRef.current) {
                const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
                if (scrollContainer) {
                    scrollContainer.scrollTop = scrollContainer.scrollHeight;
                }
            }
        }, 10);

        return () => clearTimeout(timeoutId);
    }, [messages, isLoading]);

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
                            {domToReact(domNode.children as DOMNode[])}
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
        <div className="flex flex-col h-[93vh] bg-slate-200">
            <ScrollArea className="flex-1 px-4 pt-1 pb-20" ref={scrollAreaRef}>
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex items-end ${message.role === 'assistant' ? 'justify-start' : 'justify-end'
                                }`}
                        >
                            {message.role === 'assistant' && (
                                <Avatar className="w-8 h-8 mr-2">
                                    <AvatarImage src="/logo.webp" alt="AI" className='bg-white p-1' />
                                    <AvatarFallback>AI</AvatarFallback>
                                </Avatar>
                            )}
                            <div
                                className={`text_turnBack max-w-[70%] p-3 rounded-2xl ${message.role === 'assistant'
                                    ? 'bg-white text-gray-800 rounded-bl-none'
                                    : 'bg-blue-500 text-white rounded-br-none'
                                    }`}
                            >
                                {parseAndSanitize(message.content)}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-end justify-start">
                            <Avatar className="w-8 h-8 mr-2">
                                <AvatarImage src="/placeholder.svg" alt="AI" />
                                <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                            <div className="bg-white p-3 rounded-2xl rounded-bl-none">
                                <LoadingAnimation />
                            </div>
                        </div>
                    )}
                </div>
                <ScrollBar />
            </ScrollArea>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white bg-opacity-80 shadow">
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

