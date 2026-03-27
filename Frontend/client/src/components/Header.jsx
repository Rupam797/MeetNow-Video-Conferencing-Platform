import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { ArrowRight } from "lucide-react";

const Header = () => {
    const { userData } = useContext(AppContext);
    
    return (
        <div className="w-full min-h-[80vh] bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
            <section className="w-full max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
                {/* Left Content */}
                <div className="md:w-1/2 mb-10 md:mb-0">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        Hey {userData ? userData.name.split(' ')[0] : ''},<br />
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Connect seamlessly
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg leading-relaxed">
                        High-quality video meetings for teams and individuals. Secure, reliable, and easy to use with crystal-clear
                        audio and HD video.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        <Link to={userData ? "/Dashboard" : "/Login"} className="w-full sm:w-auto">
                            <Button size="lg" className="w-full hover:shadow-lg transition-shadow">
                                Create Meeting <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link to={userData ? "/Dashboard" : "/Login"} className="w-full sm:w-auto">
                            <Button size="lg" variant="outline" className="w-full hover:bg-gray-50 dark:hover:bg-gray-700">
                                Join Meeting
                            </Button>
                        </Link>
                    </div>

                    {/* Trust indicators */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center bg-white dark:bg-gray-800 px-3 py-2 rounded-full shadow-sm">
                            <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            No credit card needed
                        </div>
                        <div className="flex items-center bg-white dark:bg-gray-800 px-3 py-2 rounded-full shadow-sm">
                            <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Free forever plan
                        </div>
                    </div>
                </div>

                {/* Right Image */}
                <div className="md:w-1/2">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 dark:opacity-15"></div>
                        <div className="relative rounded-3xl shadow-xl overflow-hidden border-4 border-white dark:border-gray-800 transition-transform hover:scale-[1.02] duration-300">
                            <img
                                src="/src/assets/header.png"
                                alt="Video conference illustration"
                                className="w-full h-auto object-cover"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Header;