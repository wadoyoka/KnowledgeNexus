'use client'

import { useState } from 'react'
import { callCloudFunction } from '../utils/callCloudFunction'
import KnowledgeTable from './KnowledgeTable'
import SubmitButton from './SubmitButton'


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
    try {
      setTarget(searchTerm);
      const response = await callCloudFunction('knowlege_search', { target: searchTerm as string })
      if (response.success && response.data) {
        const data = JSON.parse(JSON.stringify(response))
        setResult(JSON.parse(data.data.data))
        console.log(JSON.parse(data.data.data))
      } else {
        setError(response.error || '検索中にエラーが発生しました。')
      }
    } catch (err) {
      setError('検索中にエラーが発生しました。')
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-screen-[96vw] max-w-screen-xl mx-auto mt-10">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex items-center border-b border-b-2 border-blue-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="検索ワードを入力"
            aria-label="検索ワード"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SubmitButton preText={'検索'} postText={'検索中'} disabled={isLoading} />
        </div>
      </form>
      {result && (
        <div className="mt-4 p-4 rounded">
          <h2 className="font-bold text-2xl mb-2">{target!=="" && target}の検索結果</h2>
          <KnowledgeTable knowledges={result} />
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}

