'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

export default function UserProfileClient({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const tabValue = pathname.includes('/profile') ? 'profile' : 'knowledgePost';
    const router = useRouter();
    function changeTab(target: string) {
        router.push(`/UserProfile/${target}`)
    }

    return (
        <Tabs defaultValue={tabValue} className="">
            <TabsList className="ml-2 mb-6">
                <TabsTrigger value="profile" onClick={() => changeTab('profile')}>プロフィール</TabsTrigger>
                <TabsTrigger value="knowledgePost" onClick={() => changeTab('knowledgePost')}>自分の投稿</TabsTrigger>
            </TabsList>
            <TabsContent value={tabValue} className='grow w-full'>
                {children}
            </TabsContent>
        </Tabs>
    )
}

