import SideNav from "@/app/ui/components/sidenav";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/solid";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen bg-[#0f0f1a]">

            {/* Top Navbar */}
            <nav className="bg-[#0B1A33] text-white p-4 shadow-lg flex items-center justify-between m-2 rounded-xl">
                <h1 className="text-xl font-semibold">Good Morning</h1>
                <div className="flex items-center gap-6">
                    <button className="hover:text-purple-300">
                        <BellIcon className="w-7 h-7" />
                    </button>

                    <button className="hover:text-purple-300">
                        <UserCircleIcon className="w-8 h-8" />
                    </button>
                </div>
            </nav>

            {/* Main Wrapper */}
            <div className="flex flex-1 md:overflow-hidden">

                {/* Left SideBar */}
                <div className="w-full flex-none md:w-16 bg-[#0b1a33] text-white border-r border-white/10 rounded-xl ml-2 mb-2">
                    <SideNav />
                </div>

                {/* Page Content */}
                <main className="flex-grow">
                    {children}
                </main>
            </div>

            {/* Footer */}
            <footer className="w-full bg-[#0B1A33] text-gray-300 text-center py-3 mt-auto">
                © {new Date().getFullYear()} My Music App — All Rights Reserved.
            </footer>
        </div>
    );
}
