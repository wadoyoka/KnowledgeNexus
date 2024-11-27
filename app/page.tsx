import ContactForm from '@/components/ContactForm'
import { SearchForm } from '@/components/SearchForm'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <ContactForm />
      <h1 className="text-3xl font-bold text-center my-8">検索フォーム</h1>
      <SearchForm />
    </main>
  )
}

