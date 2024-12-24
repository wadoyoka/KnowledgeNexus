import { Knowledge } from "@/types/KnowledgeResponse";
import { callCloudFunction } from "@/utils/callCloudFunction";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";


export async function POST(req: Request) {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1]?.content;

    let docContext = "";

    try {
        const response = await callCloudFunction(`${process.env.NEXT_PUBLIC_FIREBASE_CLOUD_VECTOR_SEARCH_FUNCTION}`, { target: latestMessage as string })
        if (response.success && response.data) {
            const data = JSON.parse(JSON.stringify(response))
            // setResult(JSON.parse(data.data.data))
            const Knowledges: Knowledge[] = JSON.parse(data.data.data)

            for await (const Knowledge of Knowledges) {
                let urlData = ""
                const urlMap = new Map(Object.entries(Knowledge.urls));
                const urls = Array.from(urlMap.entries());
                for await (const url of urls) {
                    urlData += "URL:"+url[0]+"URLDescription:"+url[1] +" "
                }

                docContext += Knowledge.text_field + " " + "関連URL:" + urlData + " ";
            }

            const template = {
                role: "system",
                content: `
                    あなたは東京電機大学の岩井研究室について詳しいです。
                    コンテキストで受け取った情報を元に、岩井研究室についての質問に答えることができます。
                    これらのコンテキストは岩井研究室のデータベースから抽出されました。
                    レスポンスはHTML要素にしてください。
                    レスポンスにはなるべく取得したデータのURLを含んでください。
                    もしない情報がある場合はあなたの情報を使わないでください。
                    レスポンスに画像は含めないでください。
                    ----------------
                    ${docContext}
                    ----------------
                    Questions: ${latestMessage}
                    ----------------

                    `,
            };

            const result = await streamText({
                model: openai("gpt-3.5-turbo"),
                prompt: template.content,
            });

            return result.toDataStreamResponse();
        }
    } catch (err) {
        console.error(err)
        throw new Error('検索中にエラーが発生しました。')
    }
}
