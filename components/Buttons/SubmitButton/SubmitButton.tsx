import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
    /** ボタンがクリックされる前に表示されるテキスト */
    preText: string;

    /** ボタンがクリックされた後（通常はローディング中）に表示されるテキスト */
    postText: string;

    /** ボタンが無効化されているかどうか */
    disabled: boolean;

    /** ボタンの幅（例：「w-full」、「w-64」） */
    width?: string;

    /** ボタンの高さ（例：「h-10」、「h-12」） */
    height?: string;

    /** ボタンのパディング（デフォルト：「px-4 py-2」） */
    padding?: string;

    /** ボタンの基本背景色（デフォルト：「bg-DendaiTechBlue」） */
    baseColor?: string;

    /** ホバー時のボタンの背景色（デフォルト：「hover:bg-DendaiTechBlue/75」） */
    hoverColor?: string;

    /** ボタンテキストのフォントサイズ（例：「text-sm」、「text-base」） */
    fontSize?: string;

    /** ボタンテキストのフォントの太さ（例：「font-medium」、「font-bold」） */
    fontweight?: string;

    /** ボタンの基本テキスト色（デフォルト：「text-white」） */
    baseTextColor?: string;

    /** ホバー時のボタンのテキスト色（デフォルト：「text-white」） */
    hoverTextColor?: string;

    /** ボタンの角の丸み（例：「rounded-md」、「rounded-full」） */
    borderRadius?: string;

    /** ボタンの枠線の幅（例：「border」、「border-2」） */
    borderWidth?: string;

    /** ボタンの枠線の色（例：「border-gray-300」） */
    borderColor?: string;

    /** ボタンの枠線のスタイル（例：「border-solid」、「border-dashed」） */
    borderStyle?: string;

    /** 無効時にローダーをテキストの右側に配置するかどうか */
    isLoaderRight?: boolean;

    /** 無効時にローダーをテキストの右側に配置するかどうか */
    LoaderSize?: string;
}

export default function SubmitButton({ preText, postText, disabled, width, height, padding = "px-4 py-2", fontSize, fontweight, baseColor = "bg-sky-500", hoverColor = "hover:bg-sky-500/75", baseTextColor = "text-white", hoverTextColor = "text-white", borderRadius, borderWidth, borderColor, borderStyle, isLoaderRight, LoaderSize }: SubmitButtonProps) {
    return (
        <Button type="submit" className={`${width} ${height} ${padding} ${fontSize} ${fontweight} ${baseColor} ${hoverColor} ${baseTextColor} ${hoverTextColor} ${borderRadius} ${borderWidth} ${borderColor} ${borderStyle}`} disabled={disabled}>
            {disabled ? (
                <>
                    {isLoaderRight
                        ? <div className="flex">
                            {`${postText}`}
                            <Loader2 size={`${LoaderSize}`} className="ml-2 h-4 w-4 animate-spin" />
                        </div>
                        : <div className="flex">
                            <Loader2 size={`${LoaderSize}`} className="mr-2 h-4 w-4 animate-spin" />
                            {`${postText}`}
                        </div>
                    }
                </>
            ) : (
                `${preText}`
            )}
        </Button>
    )
}