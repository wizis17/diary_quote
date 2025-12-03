import { useEffect, useState } from 'react'
import { AnimatedGroup } from '@/components/ui/animated-group'
import GooeyNav from './GooeyNav'
import { getQuotes, type Quote } from '../services/quoteService'
import { useNavigate } from 'react-router-dom'
import { Footer } from './ui/Footer'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection() {
    return (
        <>
            <HeroHeader />

            <main className="overflow-hidden">
                <section>
                    <div className="relative mx-auto max-w-6xl px-6 pt-32 lg:pb-16 lg:pt-48">
                        <div className="relative z-10 mx-auto max-w-4xl text-center">
                            <AnimatedGroup
                                variants={{
                                    container: {
                                        visible: {
                                            transition: {
                                                staggerChildren: 0.05,
                                                delayChildren: 0.75,
                                            },
                                        },
                                    },
                                    ...transitionVariants,
                                }}
                            >
                                <h1
                                    className="text-balance text-4xl font-medium sm:text-5xl md:text-6xl">
                                    Discover the Wisdom
                                </h1>

                                <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg">
                                    Explore timeless Chinese quotes and unlock new meanings every day.
                                </p>

                                <div
                                    aria-hidden
                                    className="bg-radial from-primary/50 dark:from-primary/25 relative mx-auto mt-32 max-w-2xl to-transparent to-55% text-left"
                                >
                                    <div className="bg-background border-border/50 absolute inset-0 mx-auto w-80 -translate-x-3 -translate-y-12 rounded-[2rem] border p-2 [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:-translate-x-6">
                                        <div className="relative h-96 overflow-hidden rounded-[1.5rem] border p-2 pb-12 before:absolute before:inset-0 before:bg-[repeating-linear-gradient(-45deg,var(--border),var(--border)_1px,transparent_1px,transparent_6px)] before:opacity-50"></div>
                                    </div>
                                    <div className="bg-muted dark:bg-background/50 border-border/50 mx-auto w-80 translate-x-4 rounded-[2rem] border p-2 backdrop-blur-3xl [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:translate-x-8">
                                        <div className="bg-background space-y-2 overflow-hidden rounded-[1.5rem] border p-2 shadow-xl dark:bg-white/5 dark:shadow-black dark:backdrop-blur-3xl">
                                            <AppComponent />

                                            <div className="bg-muted rounded-[1rem] p-4 pb-16 dark:bg-white/5"></div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] mix-blend-overlay [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:opacity-5" />
                                </div>
                            </AnimatedGroup>
                        </div>
                    </div>
                </section>

                {/* Collection Preview Section */}
                <CollectionPreview />
            </main>
            
            <Footer />
        </>
    )
}

const CollectionPreview = () => {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const quotesData = await getQuotes();
                setQuotes(quotesData.slice(0, 4)); // Only show first 4
            } catch (error) {
                console.error('Error fetching quotes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuotes();
    }, []);

    if (loading) {
        return (
            <section id="collection" className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4fd1c5]"></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="collection" className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-white mb-4">Collection Preview</h2>
                    <p className="text-gray-400 text-lg">Explore our collection of Chinese wisdom</p>
                </div>

                {quotes.length === 0 ? (
                    <div className="text-center bg-gray-800/20 rounded-lg p-16 border border-gray-700">
                        <p className="text-gray-400 text-lg mb-6">No quotes in collection yet.</p>
                        <button
                            onClick={() => navigate('/collection')}
                            className="text-[#4fd1c5] font-medium text-sm underline underline-offset-4 transition-opacity bg-transparent border-0 cursor-pointer"
                        >
                            View All 
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {quotes.map((quote) => (
                                <div
                                    key={quote.id}
                                    onClick={() => navigate(`/quote/${quote.id}`)}
                                    className="bg-[#2a2a2a] rounded-xl border border-gray-700 overflow-hidden hover:border-[#4fd1c5] transition-all duration-300 group cursor-pointer"
                                >
                                    <div className="flex h-full">
                                        <div className="flex-1 p-4 flex flex-col justify-between">
                                            <div>
                                                <span className="text-xs text-gray-500 uppercase tracking-wide">Quote</span>
                                                <h3 className="text-xl font-bold text-white mt-2 mb-2 line-clamp-3 font-chinese">
                                                    {quote.text}
                                                </h3>
                                                <p className="text-sm text-gray-300 line-clamp-2">{quote.meaning}</p>
                                            </div>
                                        </div>
                                        <div className="w-32 bg-gradient-to-br from-[#144272] to-[#1d8496] flex items-center justify-center relative overflow-hidden">
                                            {quote.image_url ? (
                                                <img
                                                    src={quote.image_url}
                                                    alt={quote.text}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <span className="text-white/30 text-xs">Image</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center">
                            <button
                                onClick={() => navigate('/collection')}
                                className="text-gray-400 font-medium text-sm underline underline-offset-4 transition-opacity bg-transparent border-0 cursor-pointer"
                            >
                                View All
                            </button>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

const AppComponent = () => {
    return (
        <div className="relative space-y-3 rounded-[1rem] bg-white/5 p-4">
            <div className="flex items-center gap-1.5 text-orange-400">
                <svg
                    className="size-6"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 32 32">
                    <g fill="none">
                        <path
                            fill="#ff6723"
                            d="M26 19.34c0 6.1-5.05 11.005-11.15 10.641c-6.269-.374-10.56-6.403-9.752-12.705c.489-3.833 2.286-7.12 4.242-9.67c.34-.445.689 3.136 1.038 2.742c.35-.405 3.594-6.019 4.722-7.991a.694.694 0 0 1 1.028-.213C18.394 3.854 26 10.277 26 19.34"></path>
                        <path
                            fill="#ffb02e"
                            d="M23 21.851c0 4.042-3.519 7.291-7.799 7.144c-4.62-.156-7.788-4.384-7.11-8.739C9.07 14.012 15.48 10 15.48 10S23 14.707 23 21.851"></path>
                    </g>
                </svg>
                <div className="text-sm font-medium">Steps</div>
            </div>
            <div className="space-y-3">
                <div className="text-foreground border-b border-white/10 pb-3 text-sm font-medium">“千里之行，始于足下。”<br />
                A journey of a thousand miles begins with a single step.</div>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <div className="space-x-1">
                            <span className="text-foreground align-baseline text-xl font-medium">67</span>
                            <span className="text-muted-foreground text-xs">Steps/day</span>
                        </div>
                        <div className="flex h-5 items-center rounded bg-gradient-to-l from-emerald-400 to-indigo-600 px-2 text-xs text-white">2025</div>
                    </div>
                    <div className="space-y-1">
                        <div className="space-x-1">
                            <span className="text-foreground align-baseline text-xl font-medium">127</span>
                            <span className="text-muted-foreground text-xs">Steps/day</span>
                        </div>
                        <div className="text-foreground bg-muted flex h-5 w-2/3 items-center rounded px-2 text-xs dark:bg-white/20">2024</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const HeroHeader = () => {
    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Collection', href: '#collection' },
        { label: 'About', href: '#about' },
    ];

    return (
        <header className="absolute top-0 left-0 right-0 z-50 pt-8">
            <div className="flex justify-center items-center max-w-6xl mx-auto px-6">
                <GooeyNav
                    items={navItems}
                    particleCount={15}
                    particleDistances={[90, 10]}
                    particleR={100}
                    initialActiveIndex={0}
                    animationTime={600}
                    timeVariance={300}
                    colors={[1, 2, 3, 1, 2, 3, 1, 4]}
                />
            </div>
        </header>
    );
};