'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import UserFirestoreCollection from "./UserFirestore";

export default function UserProfileClient() {
    const router = useRouter();

    function changeTab(target: string) {
        router.push(`/UserProfile/${target}`)
    }

    return (
        <Tabs defaultValue={"knowledgePost"} className="">
            <TabsList className="ml-2 mb-6">
                <TabsTrigger value="profile" onClick={() => changeTab('profile')}>プロフィール</TabsTrigger>
                <TabsTrigger value="knowledgePost" onClick={() => changeTab('knowledgePost')}>自分の投稿</TabsTrigger>
            </TabsList>
            <TabsContent value="knowledgePost" className='grow w-full'>
                <div>
                    <UserFirestoreCollection />
                </div>
            </TabsContent>
        </Tabs>
    )
}

