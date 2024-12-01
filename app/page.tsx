import SignOutButton from '@/components/Buttons/SignOutButton/SignOutButton'
import { SearchForm } from '@/components/SearchForm'

export default function Home() {
  return (
    <div className="min-h-screen p-4 bg-slate-200">
      <SearchForm />
      <SignOutButton />
    </div>
  )
}

