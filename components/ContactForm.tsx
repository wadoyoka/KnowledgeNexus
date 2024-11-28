'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"
import { useState } from 'react'
import { callCloudFunction } from '../utils/callCloudFunction'
import SubmitButton from "./SubmitButton"
import { Button } from "./ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"


export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [urls, setUrls] = useState<string[]>([""]);
  const [bufUrl, setBufUrl] = useState<string>("");
  const [titles, setTitles] =useState<string[]>([""]);
  const [bufTitle, setBufTitle] = useState<string>("");


  const handleAddUrl = (url:string, title:string) =>{
    const newUrls = [...urls, url];
    setUrls(newUrls);
    setBufUrl("");
    const newTitles = [...titles, title];
    setTitles(newTitles);
    setBufTitle("");
  }

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
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="email">URL</Label>
            {urls.map((url, index) => (
              <>
                <Dialog key={`${url}_${index}`}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="text-left"><div className="flex mr-auto">{url === "" ? <p className="text-slate-400">https://example.com</p> : `${url}`}</div></Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>URLの編集</DialogTitle>
                      <DialogDescription>
                        URLとURLのタイトルを入力してください。
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-6 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          URL
                        </Label>
                        <Input
                          id={`Url_${index}`}
                          placeholder="https://example.com"
                          className="col-span-5"
                          value={bufUrl}
                          onChange={(e) => setBufUrl(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-6 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                          Title
                        </Label>
                        <Input
                          id={`Url_Title_${index}`}
                          placeholder="タイトル"
                          className="col-span-5"
                          value={bufTitle}
                          onChange={(e) => setBufTitle(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter className="flex">
                      <div className="flex ml-auto gap-2">
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            キャンセル
                          </Button>
                        </DialogClose>
                        <Button type="button" onClick={() =>{handleAddUrl(bufUrl, bufTitle)}}>保存</Button>
                      </div>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button type="button" variant={"ghost"} className="flex mx-auto my-2 bg-slate-100 w-full hover:text-sky-400">
                  <Plus />
                </Button>
              </>
            ))}
          </div>
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

