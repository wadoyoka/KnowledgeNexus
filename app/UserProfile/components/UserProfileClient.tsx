'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Session } from "next-auth";
import { useRouter, useSearchParams } from "next/navigation";
import UserFirestoreCollection from "./UserFirestore";
import UserProfile from "./UserProfile";

interface UserProfileClientProps {
    session: Session;
}


export default function UserProfileClient({ session }: UserProfileClientProps) {
    const searchParams = useSearchParams();
    const target = searchParams.get('target');
    const router = useRouter();

    function changeTab(target: string) {
        router.push(`/UserProfile?target=${target}`)
    }

    return (
        <Tabs defaultValue={`${target}`} className="">
            <TabsList>
                <TabsTrigger value="profile" onClick={() => changeTab('profile')}>プロフィール</TabsTrigger>
                <TabsTrigger value="knowledgePost" onClick={() => changeTab('knowledgePost')}>自分の投稿</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className='grow w-full'>
                <UserProfile session={session} />
            </TabsContent>
            <TabsContent value="knowledgePost" className='grow w-full'>
                <div>
                    <UserFirestoreCollection />
                </div>
            </TabsContent>
        </Tabs>
    )
}