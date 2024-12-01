import UserFirestoreCollection from './components/UserFirestore';
import UserProfile from './components/UserProfile';

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    プロフィール
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <UserProfile />
            </div>
            <div>
                <UserFirestoreCollection />
            </div>
        </div>
    );
}