import '@/app/styles/turnBack.css';
import { Knowledge } from "@/types/KnowledgeResponse";
import { JSTTimeDisplay } from "@/utils/JSTTimeDisplay";
import Link from "next/link";
import DeleteContentEllipsisVertical from "./ellipsis-vertical";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";


interface KnowledgeCardProps {
    knowledge: Knowledge;
    deleteKnowledge?: (knowledgeId: string) => void;
}

export default function KnowledgeCard({ knowledge, deleteKnowledge }: KnowledgeCardProps) {
    const urlMap = new Map(Object.entries(knowledge.urls));
    const urls = Array.from(urlMap.entries());

    return (
        <div className="relative group">
            {/* <Link
                href={`/knowledge/${knowledge.id}`}
                className="absolute inset-0 z-10"
                aria-label={`View details for ${knowledge.name}'s knowledge entry`}
            /> */}
            {/* <Card className="w-screen-[96vw] max-w-screen-xl relative transition-all duration-300 ease-in-out group-hover:bg-slate-200/10"> */}

            {/* ↓デザイン１ */}
            {/* <Card className="w-screen-[96vw] max-w-screen-xl relative transition-all duration-300 ease-in-out">
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
                                    <DeleteContentEllipsisVertical contentId={knowledge.id} userId={knowledge.uid} deleteKnowledge={deleteKnowledge}/>
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
            </Card> */}

            <div className="w-screen-[96vw] max-w-screen-xl mx-auto bg-white flex p-2 md:rounded-md lg:rounded-lg">
                {/* アイコン */}
                <div>
                    <Avatar className="my-auto w-8 h-8 md:h-10 md:w-10 duration-200 hover:opacity-75">
                        <AvatarImage src={`${knowledge.image}`} alt="logo" />
                        <AvatarFallback>Logo</AvatarFallback>
                    </Avatar>
                </div>

                {/* アイコン以外の部分 */}
                <div className="w-full ml-2">
                    <div>
                        <div className="flex">
                            <div className="flex grow ml-2 my-auto">
                                <div className="font-semibold text-base md:text-lg my-auto">
                                    {knowledge.name}
                                </div>
                                <div className="ml-auto flex">
                                    <div className="my-auto text-sm md:text-base text-slate-400 font-light">
                                        {JSTTimeDisplay(knowledge.createdAt)}
                                    </div>
                                    <div className="ml-4 z-20 flex text-slate-600">
                                        <DeleteContentEllipsisVertical contentId={knowledge.id} userId={knowledge.uid} deleteKnowledge={deleteKnowledge}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 text-sm md:text-base">
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
                        <div className='text'>
                            {knowledge.text_field}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

