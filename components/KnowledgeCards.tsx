import { Knowledge } from "@/types/KnowledgeResponse";
import KnowledgeCard from "./KnowledgeCard";

interface KnowledgeCardsProps {
    knowledges: Knowledge[];
}

export default function KnowledgeCards({knowledges}:KnowledgeCardsProps){
    return(
        <div className="flex flex-col w-screen-[96vw] max-w-screen-xl mx-auto space-y-4">
            {knowledges.map((knowledge)=>(
                <KnowledgeCard key={knowledge.id} knowledge={knowledge} />
            ))}
        </div>
    )
}