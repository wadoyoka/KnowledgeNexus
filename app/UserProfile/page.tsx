import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import UserFirestoreCollection from './components/UserFirestore';
import UserProfile from './components/UserProfile';

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/Signin?callbackUrl=UserProfile")
    }
    return (
        <div className="min-h-screen bg-slate-200 flex flex-col py-12 sm:px-6 lg:px-8">
            <Tabs defaultValue="account" className="">
                <TabsList>
                    <TabsTrigger value="profile">プロフィール</TabsTrigger>
                    <TabsTrigger value="knowledgePost">自分の投稿</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className='grow w-full'>
                    <UserProfile session={session} />
                </TabsContent>
                <TabsContent value="knowledgePost" className='grow w-full'>
                    <div>
                        <UserFirestoreCollection session={session} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}