'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import UserProfile from "./UserProfile";

interface UserProfileClientProps {
    session: Session;
}


export default function UserProfileClient({ session }: UserProfileClientProps) {
    const router = useRouter();

    function changeTab(target: string) {
        router.push(`/UserProfile/${target}`)
    }

    return (
        <Tabs defaultValue="profile" className="">
            <TabsList className="ml-2 mb-6">
                <TabsTrigger value="profile" onClick={() => changeTab('profile')}>プロフィール</TabsTrigger>
                <TabsTrigger value="knowledgePost" onClick={() => changeTab('knowledgePost')}>自分の投稿</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className='grow w-full'>
                <UserProfile session={session} />
            </TabsContent>
        </Tabs>
    )
}