import { Knowledge } from "@/types/KnowledgeResponse";
import { JSTTimeDisplay } from "@/utils/JSTTimeDisplay";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface KnowledgeCardProps {
    knowledge: Knowledge;
}

export default function KnowledgeCard({ knowledge }: KnowledgeCardProps) {
    const urlMap = new Map(Object.entries(knowledge.urls));
    const urlKeys = [urlMap.keys()];
    const urlValues = [urlMap.values()];
    const urls = Array.from(urlMap.entries());
    console.log(urlMap);
    console.log(urlKeys);
    console.log(urlValues)

    return (
        <div className="relative group">
            <Link 
                href={`/knowledge/${knowledge.id}`}
                className="absolute inset-0 z-10"
                aria-label={`View details for ${knowledge.name}'s knowledge entry`}
            />
            <Card className="w-screen-[96vw] max-w-screen-xl relative transition-all duration-300 ease-in-out group-hover:bg-black/10">
                <CardHeader>
                    <CardTitle className="flex">
                        <div className="font-bold text-xl">
                            {knowledge.name}
                        </div>
                        <div className="ml-auto text-slate-400 font-light">
                            {JSTTimeDisplay(knowledge.createdAt)}
                        </div>
                    </CardTitle>
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

