'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'
import { callCloudFunction } from '../utils/callCloudFunction'
import SubmitButton from './Buttons/SubmitButton/SubmitButton'
import KnowledgeCards from './KnowledgeCards'
import { Input } from './ui/input'


export function SearchForm() {
  const [searchTerm, setSearchTerm] = useState('')
  const [result, setResult] = useState([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [target, setTarget] = useState<string>("");


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setResult([])
    setError(null)

    if (!searchTerm.trim()) {
      setError('検索ワードを入力してください。')
      return
    }

    setIsLoading(true);
    console.log(`${process.env.NEXT_PUBLIC_FIREBASE_CLOUD_VECTOR_SEARCH_FUNCTION}`)
    try {
      setTarget(searchTerm);
      const response = await callCloudFunction(`${process.env.NEXT_PUBLIC_FIREBASE_CLOUD_VECTOR_SEARCH_FUNCTION}`, { target: searchTerm as string })
      if (response.success && response.data) {
        const data = JSON.parse(JSON.stringify(response))
        setResult(JSON.parse(data.data.data))
        console.log(JSON.parse(data.data.data))
        const jsonData = JSON.parse(data.data.data);
        console.log(typeof jsonData[0].createdAt);
      } else {
        setError(response.error || '検索中にエラーが発生しました。')
      }
    } catch (err) {
      console.error(err)
      setError('検索中にエラーが発生しました。')
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-screen-[96vw] max-w-screen-xl mx-auto mt-10">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex w-full max-w-7xl gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 md:h-8 md:w-8 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="検索"
              className="pl-12 md:pl-16 md:h-16 md:text-xl bg-white"
              aria-label="検索ワード"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className='my-auto'>
            <SubmitButton preText={'検索'} postText={'検索中'} disabled={isLoading} width='md:w-24' height='md:h-16' fontSize=' md:text-xl' />
          </div>
        </div>
      </form>
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
          <p>{error}</p>
        </div>
      )}
      {result && (
        <div className="mt-4 px-2">
          <h2 className="font-bold text-2xl mb-2">{target !== "" && `検索ワード：${target}`}</h2>
          <KnowledgeCards knowledges={result} />
        </div>
      )}
    </div>
  )
}

