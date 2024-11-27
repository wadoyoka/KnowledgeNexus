import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Knowledge } from "@/types/KnowledgeResponse";

interface KnowledgeTableProps {
    knowledges: Knowledge[];
}

export default function KnowledgeTable({ knowledges }: KnowledgeTableProps) {
    if (!Array.isArray(knowledges)) {
        return null;
    }

    return (
        <Table>
            <TableCaption>検索結果一覧</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Text</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {knowledges.map((knowledge) => (
                    <TableRow key={knowledge.id}>
                        <TableCell className="font-medium">{knowledge.id}</TableCell>
                        <TableCell>{knowledge.name}</TableCell>
                        <TableCell>{knowledge.text_field}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

