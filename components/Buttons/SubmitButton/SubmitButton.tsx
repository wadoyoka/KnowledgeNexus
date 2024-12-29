import { Loader2, LucideIcon } from 'lucide-react';
import { type IconType } from 'react-icons';

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

    /** ローダーのサイズ */
    LoaderSize?: number;

    /** ボタンがクリックされたときに呼び出される関数 */
    onClick?: () => void;

    type?: "submit" | "reset" | "button" | undefined;

    /** Optional Lucide React icon or React Icons icon to display on the button */
    icon?: LucideIcon | IconType;

    /** Position of the icon (left or right) */
    iconPosition?: 'left' | 'right';

    /** アイコンのサイズ（デフォルトはLoaderSizeと同じ） */
    iconSize?: number;
}

export default function SubmitButton({ 
    preText, 
    postText, 
    disabled, 
    width, 
    height, 
    padding = "px-4 py-2", 
    fontSize, 
    fontweight, 
    baseColor = "bg-sky-500", 
    hoverColor = "hover:bg-sky-500/75", 
    baseTextColor = "text-white", 
    hoverTextColor = "group-hover:text-white", 
    borderRadius = "rounded-md", 
    borderWidth, 
    borderColor, 
    borderStyle, 
    isLoaderRight, 
    LoaderSize = 18, 
    type = "submit", 
    onClick, 
    icon: Icon, 
    iconPosition = 'left',
    iconSize,
}: SubmitButtonProps) {
    const IconComponent = Icon ? (
        <Icon size={iconSize ?? LoaderSize} className={iconPosition === 'left' ? 'mr-2' : 'ml-2'} />
    ) : null;

    return (
        <button
            type={type}
            className={`${width} ${height} ${padding} ${fontSize} ${fontweight} ${baseColor} ${hoverColor} ${baseTextColor} ${hoverTextColor} ${borderRadius} ${borderWidth} ${borderColor} ${borderStyle} group flex items-center justify-center duration-300`}
            disabled={disabled}
            onClick={onClick}
        >
            {disabled ? (
                <>
                    {isLoaderRight ? (
                        <>
                            <span className={`${baseTextColor} ${hoverTextColor} duration-200`}>{postText}</span>
                            <Loader2 size={LoaderSize} className="ml-2 animate-spin" />
                        </>
                    ) : (
                        <>
                            <Loader2 size={LoaderSize} className="mr-2 animate-spin" />
                            <span className={`${baseTextColor} ${hoverTextColor} duration-200`}>{postText}</span>
                        </>
                    )}
                </>
            ) : (
                <>
                    {iconPosition === 'left' && IconComponent}
                    <span className={`${baseTextColor} ${hoverTextColor} duration-200`}>{preText}</span>
                    {iconPosition === 'right' && IconComponent}
                </>
            )}
        </button>
    );
}

