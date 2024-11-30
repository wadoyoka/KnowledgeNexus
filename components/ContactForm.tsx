'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"
import { useState } from 'react'
import * as z from "zod"
import { callCloudFunction } from '../utils/callCloudFunction'
import SubmitButton from "./SubmitButton"
import { Button } from "./ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"


export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [urls, setUrls] = useState<string[]>([""]);
  const [bufUrls, setBufUrls] = useState<string[]>([""]);
  const [titles, setTitles] = useState<string[]>([""]);
  const [bufTitles, setBufTitles] = useState<string[]>([""]);
  const [errorMessage, setErrorMessage] = useState<string>();


  const handleAddUrlwithTitle = (url: string, title: string, index: number) => {
    const urlSchema = z.object({
      url: z.string().url("urlの形式になっていません").max(2000, "urlは最大2000文字までです。"),
      title: z.string().min(0).max(100,"URLのタイトルは100文字までです。"),
    });
    if (url !== "") {
      try {
        const validatedData = urlSchema.parse({
          url,
          title
        });
        const newUrls = [...urls];
        newUrls[index] = validatedData.url;
        setUrls(newUrls);
        const newTitles = [...titles];
        newTitles[index] = validatedData.title;
        setTitles(newTitles);
      } catch (error) {
        if (error instanceof z.ZodError) {
          // 最初のエラーメッセージを返す
          
          setErrorMessage(error.errors[0].message);
          return error.errors[0].message;
        }
        throw error;
      }
    }else{
      setErrorMessage("URLの欄に何も入力されてません")
    }
  }

  const handleInitializeBufData = (index: number) => {
    const newbufUrls = [...bufUrls];
    newbufUrls[index] = urls[index];
    setBufUrls(newbufUrls);
    const newbufTitles = [...bufTitles];
    newbufTitles[index] = titles[index];
    setBufTitles(newbufTitles);
  }

  const handleChangeBufUrl = (bufUrl: string, index: number) => {
    const newbufUrls = [...bufUrls];
    newbufUrls[index] = bufUrl;
    setBufUrls(newbufUrls);
  }

  const handleChangeBufTitle = (bufTitle: string, index: number) => {
    const newbufTitles = [...bufTitles];
    newbufTitles[index] = bufTitle;
    setBufTitles(newbufTitles);
  }

  const addUrlField = () => {
    if (urls.length < 10 && urls[urls.length - 1] !== "") {
      setUrls([...urls, ""]);
    }
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
            <p className="text-red-600">{errorMessage && errorMessage}</p>
            {urls.map((url, index) => (
              <Dialog key={`URL_${index}`}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-left" onClick={() => { handleInitializeBufData(index) }}><div className="flex mr-auto">{url === "" ? <p className="text-slate-400">https://example.com</p> : `${url}`}</div></Button>
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
                        type="url"
                        className="col-span-5"
                        value={bufUrls[index]}
                        onChange={(e) => handleChangeBufUrl(e.target.value, index)}
                        required
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
                        value={bufTitles[index]}
                        onChange={(e) => handleChangeBufTitle(e.target.value, index)}
                      />
                    </div>
                  </div>
                  <DialogFooter className="flex">
                    <div className="flex ml-auto gap-2">
                      <DialogClose asChild>
                        <div>
                          <Button type="button" variant="outline">
                            キャンセル
                          </Button>
                          <Button type="button" className="ml-2" onClick={() => { handleAddUrlwithTitle(bufUrls[index], bufTitles[index], index) }}>保存</Button>
                        </div>
                      </DialogClose>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ))}
            <Button type="button" variant={"ghost"} onClick={addUrlField} className="flex mx-auto my-2 bg-slate-100 w-full hover:text-sky-400">
              <Plus />
            </Button>
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

