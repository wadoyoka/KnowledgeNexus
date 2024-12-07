'use client'

import SubmitButton from "@/components/Buttons/SubmitButton/SubmitButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Knowledge } from "@/types/KnowledgeResponse"
import { callCloudFunction } from "@/utils/callCloudFunction"
import { Plus, X } from 'lucide-react'
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from 'react'
import * as z from "zod"
import UpdateKnowledgeAvatar from "./UpdateKnowledgeAvatar"

interface UpdateKnowledgeFormProps {
  initialKnowledge: Knowledge;
}

export default function UpdateKnowledgeForm({ initialKnowledge }: UpdateKnowledgeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [urls, setUrls] = useState<string[]>([])
  const [bufUrls, setBufUrls] = useState<string[]>([])
  const [titles, setTitles] = useState<string[]>([])
  const [bufTitles, setBufTitles] = useState<string[]>([])
  const [isSendSlack, setIsSendSlack] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [message, setMessage] = useState('')
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession()

  useEffect(() => {
    if (initialKnowledge) {
      const initialUrls = Object.keys(initialKnowledge.urls)
      const initialTitles = Object.values(initialKnowledge.urls)
      setUrls(initialUrls)
      setTitles(initialTitles)
      setBufUrls(initialUrls)
      setBufTitles(initialTitles)
      setMessage(initialKnowledge.text_field)
    }
  }, [initialKnowledge])

  if (status !== "authenticated") {
    return <p>Loading...</p>
  }

  if (!session) {
    router.push(`/Signin?callbackUrl=${pathname}`)
    return null
  }

  const handleAddUrlwithTitle = (url: string, title: string, index: number) => {
    const urlSchema = z.object({
      url: z.string().url("urlの形式になっていません").max(2000, "urlは最大2000文字までです。"),
      title: z.string().min(0).max(100, "URLのタイトルは100文字までです。"),
    });
    if (url !== "" && !urls.includes(url)) {
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
        setErrorMessage("");
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrorMessage(error.errors[0].message);
          return error.errors[0].message;
        }
        throw error;
      }
    } else if (url === "") {
      setErrorMessage("URLの欄に何も入力されてません")
    } else if (urls.includes(url) && index === urls.findIndex((element) => element === url) && titles[index] === title) {
      setErrorMessage("")
    } else if (urls.includes(url) && index === urls.findIndex((element) => element === url) && titles[index] !== title) {
      try {
        const validatedData = urlSchema.parse({
          url,
          title
        });
        const newTitles = [...titles];
        newTitles[index] = validatedData.title;
        setTitles(newTitles);
        setErrorMessage("");
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrorMessage(error.errors[0].message);
          return error.errors[0].message;
        }
        throw error;
      }
    } else if (urls.includes(url)) {
      setErrorMessage("このURLは既に入力されています。")
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
      setTitles([...titles, ""])
    }
  }

  const removeUrlField = (targetUrl: string) => {
    const targetIndex = urls.findIndex((element) => element === targetUrl);
    const newUrls = urls.filter((url) => url !== targetUrl);
    const newTitles = titles.filter((title) => title !== titles[targetIndex]);
    setUrls(newUrls);
    setTitles(newTitles);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true);
    const knowledgeSchema = z.object({
      uid: z.string(),
      name: z.string().min(1, "名前は一文字以上にしてください。").max(100, "名前は１００文字までにしてください。"),
      email: z.string().email("有効なメールアドレスを入力してください").refine(
        (email) => email.endsWith("@cps.im.dendai.ac.jp"),
        "メールアドレスは @cps.im.dendai.ac.jp で終わる必要があります"
      ),
      image: z.string().url(),
      bufUrls: z.array(z.string().url().max(2000)).min(1, "URLは最低一つ必要です").max(10, "URLは最大10個までです"),
      message: z.string().min(10, "メモ内容は１０文字以上入力してください。").max(500, "メモ内容は５００文字までです。"),
    });

    try {
      const UrlWithTitleMap = new Map<string, string>();
      for (let index = 0; index < urls.length; index++) {
        if (urls[index] === "") {
          continue;
        }
        UrlWithTitleMap.set(urls[index], titles[index]);
      }
      const keyValue = Object.fromEntries(UrlWithTitleMap);

      const validatedData = knowledgeSchema.parse({
        uid: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        bufUrls: urls,
        message: message
      });

      const data = {
        id: initialKnowledge.id,
        uid: validatedData.uid,
        name: validatedData.name,
        email: validatedData.email,
        image: validatedData.image,
        urls: keyValue,
        message: validatedData.message,
      }

      const result = await callCloudFunction(`${process.env.NEXT_PUBLIC_FIREBASE_CLOUD_UPDATE_KNOWLEDGE_FUNCTION}`, data);
      if (result.success) {
        toast({
          title: "更新成功",
          description: "知識が正常に更新されました。",
        })
        router.push('/UserProfile')
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error updating knowledge:', error)
      toast({
        title: "エラー",
        description: error instanceof z.ZodError ? error.errors[0].message : `更新中にエラーが発生しました。もう一度お試しください。\n${error}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto ">
      <CardHeader>
        <div className="flex">
          <UpdateKnowledgeAvatar />
          <CardTitle className="ml-4 my-auto">{session.user.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="email">URL</Label>
            <p className="text-red-600">{errorMessage && errorMessage}</p>
            {urls.map((url, index) => (
              <div key={`URL_${index}`} className="block grid grid-cols-7 gap-2">
                <div className={urls.length > 1 ? "col-span-6" : "col-span-7"}>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full" onClick={() => { handleInitializeBufData(index) }}>
                        <span className="block truncate mr-auto">
                          {url === "" ? <p className="text-slate-400">https://example.com</p> : `${url}`}
                        </span>
                      </Button>
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
                </div>

                {urls.length > 1 &&
                  <div className="ml-auro">
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      type="button"
                      className="hover:text-red-500"
                      onClick={() => { removeUrlField(url) }}
                    >
                      <X />
                    </Button>
                  </div>
                }
              </div>
            ))}
            <Button type="button" variant={"ghost"} onClick={addUrlField} className="flex mx-auto my-2 bg-slate-100 w-full hover:text-sky-400">
              <Plus />
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">メモ内容</Label>
            <Label htmlFor="message">メモ内容</Label>
            <Textarea 
              id="message" 
              name="message" 
              rows={10} 
              required 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={isSendSlack} 
                onCheckedChange={() => { setIsSendSlack((prev) => !prev) }} 
                className={`data-[state=checked]:bg-sky-600 data-[state=checked]:text-white`} 
              />
              <label
                htmlFor="terms"
                className={`${isSendSlack ? "font-bold text-lg text-sky-600" : "leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-lg text-slate-400 font-bold text-lg text-sky-600"}`}
              >
                Slackに通知する
              </label>
            </div>
          </div>
          <SubmitButton preText={"更新"} postText={"更新中"} disabled={isLoading} width="w-full" />
        </form>
      </CardContent>
    </Card>
  )
}

