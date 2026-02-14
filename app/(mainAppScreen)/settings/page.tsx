
import Breadcrumbs from "@/app/ui/components/Breadcrumbs";
import SettingsClientSection from "./SettingsClientSection";


export default function SettingsPage() {
    return (
        <div className="p-4 md:p-6 lg:p-10 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 text-white pb-20 md:pb-4">
            <Breadcrumbs items={[{ label: "Home", href: "/home" }, { label: "Settings" }]} />

            <h1 className="text-2xl md:text-4xl font-bold mb-8 mt-4">Settings</h1>

            {/* Settings Sections */}
            <div className="space-y-6 max-w-2xl">
                {/* Account Section */}
                <div className=" rounded-lg p-4 md:p-6 border border-white/10">
                    <h2 className="text-lg font-bold mb-4">Account</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center pb-3 border-b border-white/5">
                            <span className="text-gray-300">Email</span>
                            <span className="text-gray-500">user@example.com</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-white/5">
                            <span className="text-gray-300">Username</span>
                            <span className="text-gray-500">Your Username</span>
                        </div>
                        <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Preferences Section */}
                <div className=" rounded-lg p-4 md:p-6 border border-white/10">
                    <h2 className="text-lg font-bold mb-4">Preferences</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Dark Mode</span>
                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Explicit Content</span>
                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Notifications</span>
                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                        </div>
                    </div>
                </div>

                {/* Audio Section */}
                <div className=" rounded-lg p-4 md:p-6 border border-white/10">
                    <h2 className="text-lg font-bold mb-4">Audio Quality</h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <input type="radio" name="quality" defaultChecked id="high" />
                            <label htmlFor="high" className="text-gray-300 cursor-pointer">
                                High Quality (320 kbps)
                            </label>
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="radio" name="quality" id="medium" />
                            <label htmlFor="medium" className="text-gray-300 cursor-pointer">
                                Medium Quality (192 kbps)
                            </label>
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="radio" name="quality" id="low" />
                            <label htmlFor="low" className="text-gray-300 cursor-pointer">
                                Low Quality (128 kbps)
                            </label>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className=" rounded-lg p-4 md:p-6 border border-white/10">
                    <h2 className="text-lg font-bold mb-4">About</h2>
                    <div className="space-y-2 text-gray-400 text-sm">
                        <p>My Music App v1.0.0</p>
                        <p>© 2026 My Music App. All rights reserved.</p>
                        <div className="flex gap-4 mt-4">
                            <a href="#" className="text-blue-400 hover:text-blue-300">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-blue-400 hover:text-blue-300">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>

                {/* Logout */}
                <SettingsClientSection />
            </div>
        </div>
    );
}