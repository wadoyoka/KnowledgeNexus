'use client'

import { Knowledge } from '@/types/KnowledgeResponse'
import { Loader2, Search } from 'lucide-react'
import { useState } from 'react'
import { callCloudFunction } from '../utils/callCloudFunction'
import KnowledgeCards from './KnowledgeCards'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Input } from './ui/input'


export function SearchForm() {
  const [searchTerm, setSearchTerm] = useState('')
  const [knowledges, setKnowledges] = useState<Knowledge[]>([]);
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [target, setTarget] = useState<string>("");


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setKnowledges([])
    setError(null)

    if (!searchTerm.trim()) {
      setError('検索ワードを入力してください。')
      return
    }

    setIsLoading(true);
    console.log(`${process.env.NEXT_PUBLIC_FIREBASE_CLOUD_VECTOR_SEARCH_FUNCTION}`)
    try {
      setTarget(searchTerm);
      const response = await callCloudFunction(`${process.env.NEXT_PUBLIC_FIREBASE_CLOUD_VECTOR_SEARCH_FUNCTION}`, 
        { target: searchTerm as string,
          searchLimit: 20,
        }
      );
      if (response.success && response.data) {
        const data = JSON.parse(JSON.stringify(response))
        setKnowledges(JSON.parse(data.data.data))
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

  const deleteKnowledge = (knowledgeId: string) => {
    const newKnowledges = knowledges.filter((element) => element.id != knowledgeId)
    console.log(newKnowledges)
    setKnowledges(newKnowledges);
  }


  return (
    <div className="w-full md:w-screen-[96vw] max-w-screen-xl mx-auto mt-10">
      {/* 検索窓 */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex w-full max-w-7xl px-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 md:h-8 md:w-8 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="検索"
              className="pl-12 md:pl-16 md:h-16 md:text-xl bg-white h-12"
              aria-label="検索ワード"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className='my-auto md:ml-4'>
            <button type='submit' className='font-extrabold text-xl bg-sky-500 text-white w-24 h-12 md:h-16 rounded-lg hidden md:block duration-200 hover:bg-sky-700'>
              {isLoading ? <p>検索中</p> : <p>検索</p>}
            </button>
          </div>
        </div>
      </form>
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
          <p>{error}</p>
        </div>
      )}


      {/* 検索結果 */}
      {(knowledges.length !== 0 || isLoading) ?
        <div className="mt-4 md:px-2">
          <h2 className="font-bold text-2xl max-md:ml-2 mb-6">{target !== "" && `検索ワード：${target}`}</h2>
          {isLoading && <Loader2 className="mx-auto mt-4 w-12 h-12 md:h-24 md:w-24 animate-spin" />}
          <KnowledgeCards knowledges={knowledges} deleteKnowledge={deleteKnowledge} />
        </div>

        :
        <div className='flex flex-col items-center justify-center min-h-[65vh]'>
          <Avatar className="w-32 h-32 md:w-48 md:h-48 mx-auto animate-spin-slow">
            <AvatarImage src="/logodata/logo_BlackColor.webp" alt="Logo" className='p-1 opacity-30' />
            <AvatarFallback>Logo</AvatarFallback>
          </Avatar>
          <h2 className='font-semibold text-slate-600 mt-4'>ナレッジを検索しましょう!!</h2>
        </div>
      }


    </div>
  )
}

