import { Knowledge } from "@/types/KnowledgeResponse";
import KnowledgeCard from "./KnowledgeCard";

interface KnowledgeCardsProps {
    knowledges: Knowledge[];
    deleteKnowledge?:(knowledgeId: string) => void;
}

export default function KnowledgeCards({knowledges, deleteKnowledge}:KnowledgeCardsProps){
    return(
        <div className="flex flex-col w-full md:w-screen-[96vw] max-w-screen-xl mx-auto space-y-2">
            {knowledges.map((knowledge)=>(
                <KnowledgeCard key={knowledge.id} knowledge={knowledge} deleteKnowledge={deleteKnowledge} />
            ))}
        </div>
    )
}