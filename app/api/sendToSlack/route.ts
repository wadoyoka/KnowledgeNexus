import { IncomingWebhook } from "@slack/webhook";
import { NextResponse } from "next/server";

const webhookUrl = process.env.SLACK_WEBHOOK_URL;

if (!webhookUrl) {
  throw new Error("Slack Webhook URL is not defined in environment variables.");
}

const webhook = new IncomingWebhook(webhookUrl);

export async function POST(request: Request) {
  const { message, urls, username } = await request.json();

  const formattedUrls = Object.entries(urls)
    .map(([url, title]) => `<${url}|${title}>`)
    .join("\n");

  const slackMessage = `新しい知識が登録されました:
ユーザー: ${username}
メモ内容: ${message}
URLとタイトル: ${formattedUrls} `;
  try {
    await webhook.send({ text: slackMessage });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Slack通知中にエラーが発生しました:", error.message);
      return NextResponse.json({ success: false, error: error.message });
    } else {
      console.error("予期しないエラーが発生しました:", error);
      return NextResponse.json({
        success: false,
        error: "予期しないエラーが発生しました。",
      });
    }
  }
}
