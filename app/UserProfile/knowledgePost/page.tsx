import UserProfileClient from '../components/UserProfile_CommonClient';
import UserFirestoreCollection from './components/UserFirestore';

export default function ProfilePage() {
    return (
        <UserProfileClient>
            <UserFirestoreCollection />
        </UserProfileClient>
    );
}

