import { PenTool, Search } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import HeaderAvatar from "./HeaderAvatar";

export default function Header() {
    return (
        <header className="w-full bg-white h-16 shadow-sm flex">
            <div className="flex">
                <Link href={"/"} className="flex duration-200 hover:opacity-75">
                    <Avatar className="ml-4 my-auto h-12 w-12">
                        <AvatarImage src="/logo.webp" alt="logo" />
                        <AvatarFallback>Logo</AvatarFallback>
                    </Avatar>
                    <h1 className="ml-4 my-auto font-black text-4xl text-sky-600 hidden md:block">Knowledge Nexus</h1>
                </Link>
            </div>
            <div className="ml-auto mr-2 flex space-x-2 my-auto">
                <Link href={"/"}>
                    <button type="button" className="p-2 md:h-14 gap-2 group">
                        <div className="flex relative overflow-hidden space-x-1">
                            <div>
                                <Search size={26} />
                            </div>
                            <p className="my-auto hidden text-xl font-bold md:block hover:text-accent-foreground">検索する</p>
                            <span className="hidden md:block absolute bottom-0 left-1/2 w-0 h-0.5 bg-accent-foreground transition-all group-hover:w-full group-hover:left-0"></span>
                        </div>
                    </button>
                </Link>
                <Link href={"/CreateKnowledge"}>
                    <button type="button" className="p-2 md:h-14 group">
                        <div className="flex relative overflow-hidden space-x-1">
                            <div>
                                <PenTool size={26} />
                            </div>
                            <p className="my-auto hidden text-xl font-bold md:block hover:text-accent-foreground">検索する</p>
                            <span className="hidden md:block absolute bottom-0 left-1/2 w-0 h-0.5 bg-accent-foreground transition-all group-hover:w-full group-hover:left-0"></span>
                        </div>
                    </button>
                </Link>
                <HeaderAvatar />
            </div>
        </header>
    )
}