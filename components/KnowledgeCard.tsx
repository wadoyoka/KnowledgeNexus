import { Knowledge } from "@/types/KnowledgeResponse";
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
        <Card className="w-screen-[96vw] max-w-screen-xl mb-4">
            <CardHeader>
                <CardTitle className="font-bold text-xl">{knowledge.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc pl-4 mb-2">
                    {urls.map(([key, value]) => (
                        <li key={key}>
                            <Link href={key}  rel="noopener noreferrer" target="_blank" className="text-blue-600 visited:text-purple-600 hover:underline">{value}</Link>
                        </li>
                    ))}
                </ul>
                <div>
                    {knowledge.text_field}
                </div>
            </CardContent>
        </Card>
    )
}