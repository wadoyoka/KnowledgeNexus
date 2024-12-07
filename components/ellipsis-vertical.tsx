'use client';
import SubmitButton from "@/components/Buttons/SubmitButton/SubmitButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import deleteDocument from "@/utils/firebase/deleteDocument";
import { EllipsisVertical, PenTool, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";


interface DeleteContentEllipsisVerticalProps {
    contentId: string;
    userId: string;
}

export default function DeleteContentEllipsisVertical({ contentId, userId }: DeleteContentEllipsisVerticalProps) {
    const { data: session, status } = useSession();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<Error | string>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();



    const deleteContentWithId = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true);
        try {
            const result = await deleteDocument("KnowledgeNexus", contentId);
            if (result === true) {
                setErrorMessage("");
                router.refresh();
                setIsSubmitting(false);
                toast({
                    title: "投稿削除成功",
                    description: "投稿の削除に成功しました",
                })
                setIsDialogOpen(false);
            }
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error);
            }
        }
    }

    if (session?.user.id !== userId || status !== "authenticated") {
        return null;
    }

    return (

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="rounded-full hover:bg-gray-400">
                    <EllipsisVertical />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="left" align="start">
                <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>削除</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/UpdateKnowledge/${contentId}`)}>
                    <PenTool className="mr-2 h-4 w-4" />
                    <span>編集</span>
                </DropdownMenuItem>
            </DropdownMenuContent>


            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>投稿削除確認</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        投稿を削除しても良いかの確認です。
                        {errorMessage && <p className="text-red-500 mt-2">{errorMessage.toString()}</p>}
                    </DialogDescription>
                    <DialogFooter className="flex">
                        <div className="flex ml-auto gap-2">
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    キャンセル
                                </Button>
                            </DialogClose>
                            <form onSubmit={deleteContentWithId}>
                                <SubmitButton preText="削除" postText="削除中..." disabled={isSubmitting} />
                            </form>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DropdownMenu>
    )
}