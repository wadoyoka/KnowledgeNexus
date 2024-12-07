import { Knowledge } from "@/types/KnowledgeResponse";
import { JSTTimeDisplay } from "@/utils/JSTTimeDisplay";
import Link from "next/link";
import DeleteContentEllipsisVertical from "./ellipsis-vertical";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface KnowledgeCardProps {
    knowledge: Knowledge;
}

export default function KnowledgeCard({ knowledge }: KnowledgeCardProps) {
    const urlMap = new Map(Object.entries(knowledge.urls));
    const urlKeys = [urlMap.keys()];
    const urlValues = [urlMap.values()];
    const urls = Array.from(urlMap.entries());

    return (
        <div className="relative group">
            <Link
                href={`/knowledge/${knowledge.id}`}
                className="absolute inset-0 z-10"
                aria-label={`View details for ${knowledge.name}'s knowledge entry`}
            />
            <Card className="w-screen-[96vw] max-w-screen-xl relative transition-all duration-300 ease-in-out group-hover:bg-slate-200/10">
                <CardHeader>
                    <div className="flex">
                        <Avatar className="my-auto h-10 w-10 duration-200 hover:opacity-75">
                            <AvatarImage src={`${knowledge.image}`} alt="logo" />
                            <AvatarFallback>Logo</AvatarFallback>
                        </Avatar>
                        <CardTitle className="flex grow ml-2 my-auto">
                            <div className="font-bold text-xl">
                                {knowledge.name}
                            </div>
                            <div className="ml-auto flex">
                                <div className="my-auto text-slate-400 font-light">
                                    {JSTTimeDisplay(knowledge.createdAt)}
                                </div>
                                <div className="ml-2 my-auto z-20">
                                    <DeleteContentEllipsisVertical contentId={knowledge.id} userId={knowledge.uid} />
                                </div>
                            </div>
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="">
                    <ul className="list-disc pl-4 mb-2">
                        {urls.map(([key, value]) => (
                            <li key={key}>
                                <Link
                                    href={key}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    className="relative z-20 text-blue-600 visited:text-purple-600 hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {value}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div>
                        {knowledge.text_field}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

