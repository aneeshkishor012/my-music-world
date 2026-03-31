
"use client";
import { ChevronLeftIcon, InformationCircleIcon, PlayIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";


interface PlaylistMasterCardProps {
    item: {
        type: string;
        imageUri?: string;
        title: string;
        description?: string;
    };
    songs: any[];
    handleItemClick: (index: number) => void;
}

export default function PlaylistMasterCard({ item, songs, handleItemClick }: PlaylistMasterCardProps) {
    const router = useRouter();
    return (
        <div className=" pt-2 pb-2 pl-2 pr-2 rounded-xl mb-2">
            <div className="flex flex-row justify-between items-start px-2">
                <button
                    onClick={() => router.back()}
                    className="border-none rounded-lg hover:!bg-white/10 bg-transparent text-white flex items-center justify-center transition-all duration-300"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <div>
                    <h4 className="text-sm text-blue-400 text-center mb-5 uppercase tracking-wider">{item.type}</h4>
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-4 px-2 mx-6">
                        <div className="w-32 h-32 relative shrink-0  rounded-lg shadow-lg overflow-hidden">
                            {item.imageUri ? (
                                <Image
                                    src={item.imageUri}
                                    alt={item.title || "Cover"}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-600">?</div>
                            )}
                        </div>
                        <div className="flex flex-col justify-end items-center text-center md:items-start md:text-left">
                            <h1 className="text-xl md:text-xl font-bold mb-3">{item.title}</h1>

                            <p className="text-gray-400 max-w-xl">
                                {item.description}
                            </p>

                            <div className="mt-4 flex gap-3 justify-center md:justify-start">
                                <button
                                    onClick={() => songs.length > 0 && handleItemClick(0)}
                                    className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-90 hover:scale-105 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/20"
                                >
                                    <PlayIcon className="w-5 h-5" /> Play
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                <button
                    className="border-none rounded-lg hover:!bg-white/10 bg-transparent text-white flex items-center justify-center transition-all duration-300"
                >
                    <InformationCircleIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    )
}