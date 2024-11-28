'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useState } from 'react'
import { callCloudFunction } from '../utils/callCloudFunction'
import SubmitButton from "./SubmitButton"


export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      console.log(formData)
      const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        message: formData.get('message') as string,
      }

      console.log(data);

      const result = await callCloudFunction('text_embedding', data)

      console.log(result);

      if (result.success) {
        toast({
          title: "送信成功",
          description: "メッセージが正常に送信されました。",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "送信中にエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>データ登録</CardTitle>
        <CardDescription>以下のフォームに情報を入力してください。</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">お名前</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input id="url" name="url" required type="url" />
          </div> */}
          <div className="space-y-2">
            <Label htmlFor="message">メモ内容</Label>
            <Textarea id="message" name="message" required />
          </div>
          <SubmitButton preText={"送信"} postText={"送信中"} disabled={isLoading} width="w-full" />
        </form>
      </CardContent>
    </Card>
  )
}

