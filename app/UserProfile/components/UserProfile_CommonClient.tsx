'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UserProfileClient({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const tabValue = pathname.includes('/profile') ? 'profile' : 'knowledgePost';

    return (
        <Tabs defaultValue={tabValue} className="">
            <TabsList className="ml-2 mb-6">
                <TabsTrigger value="profile">
                    <Link href="/UserProfile/profile">プロフィール</Link>
                </TabsTrigger>
                <TabsTrigger value="knowledgePost">
                    <Link href="/UserProfile/knowledgePost">自分の投稿</Link>
                </TabsTrigger>
            </TabsList>
            <TabsContent value={tabValue} className='grow w-full'>
                {children}
            </TabsContent>
        </Tabs>
    )
}

