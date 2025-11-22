import React, { useState, useEffect } from 'react';
import { ArrowUpRight, X, Disc } from 'lucide-react';

/* VELARA 2026
  Aesthetic: Swiss-Cyber
  Architecture: Vercel Serverless + Client Fallback
*/

// --- Fallback Data (Used if API is empty or offline) ---
const MOCK_DATA = [
  {
    id: 1,
    tag: "EVO.001",
    headline: "The Death of the Junior Developer",
    sub: "Evolution of Mastery",
    readTime: "04:15",
    summary: "The career ladder has collapsed. Your value is no longer code syntax, but system architecture. Stop learning languages; start learning logic flows.",
    content: "We are witnessing the end of the apprenticeship model. For centuries, humans learned by doing the grunt work—mixing the paints, chopping the vegetables, writing the boilerplate functions.\n\nToday, the 'grunt work' is instant and free. The AI agents released this week don't just write code; they understand context. This forces a terrifying but necessary evolution: we must all become seniors immediately.\n\nThe philosophical question isn't 'will AI replace coders?', but 'what happens to human mastery when the path to mastery—the struggle—is removed?' If the machine solves the maze instantly, do we lose the ability to navigate? The developers who survive 2026 will not be those who write the best loops, but those who ask the best questions.",
    visualColor: "bg-[#ccff00]" // Acid Lime
  },
  {
    id: 2,
    tag: "TRUTH.002",
    headline: "Synthetic Truth & The Crisis",
    sub: "Post-Epistemology",
    readTime: "03:45",
    summary: "Trust nothing on a screen. Your personal reputation and physical presence are now your only unhackable assets. Invest in face-to-face networks.",
    content: "The cost of generating reality has dropped to zero. Yesterday's release of the 'Mirror-2' model means video evidence is no longer admissible in the court of public opinion. We are entering an era of 'Post-Epistemology'—where knowing what is true is less important than knowing who is speaking.\n\nParadoxically, this digital flood drives us back to the analog. The handshake, the signed paper, the room shared with another human—these are no longer quaint traditions. They are the only security protocols that still work. In a world of infinite synthetic noise, biological presence becomes the ultimate luxury good.",
    visualColor: "bg-[#ff4d00]" // Safety Orange
  },
  {
    id: 3,
    tag: "UTIL.003",
    headline: "Intelligence as a Utility",
    sub: "The Commodity Trap",
    readTime: "05:00",
    summary: "Intelligence is now as cheap as electricity. Don't hoard knowledge; hoard unique questions. The person with the best prompt rules the grid.",
    content: "We used to treat intelligence as a scarce resource, mined from elite universities and refined over decades of study. Now, it is a utility flowing from the wall socket. When IQ 160 is available via API for pennies, the definition of 'smart' in 2026 shifts. It is no longer about retention or calculation.\n\nIt is about *Curiosity*. The machine can answer any question, but it cannot care about the answer. The distinctly human contribution to the future is not intelligence, but *intent*. Why do we want to know? That is the only thing the machine cannot simulate. The future belongs to the curious, not the calculating.",
    visualColor: "bg-[#e0e0e0]" // Silver
  }
];

export default function App() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // 1. Mount Animation
    setMounted(true);

    // 2. Clock Tick
    const tick = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    };
    tick();
    const interval = setInterval(tick, 1000);

    // 3. Data Fetching Strategy
    const loadNews = async () => {
      try {
        const res = await fetch('/api/news');
        if (!res.ok) throw new Error('API unavailable');
        
        const data = await res.json();
        
        // Use API data if available, otherwise use Mock
        if (data && Array.isArray(data) && data.length > 0) {
          setNewsData(data);
        } else {
          console.log("Velara: No live data found, loading fallback.");
          setNewsData(MOCK_DATA);
        }
      } catch (error) {
        console.warn("Velara: API unavailable (expected in local dev), loading fallback.", error.message);
        setNewsData(MOCK_DATA);
      } finally {
        setLoading(false);
      }
    };

    loadNews();

    return () => clearInterval(interval);
  }, []);

  // --- Components ---

  const Header = () => (
    <header className="fixed top-0 left-0 w-full z-40 px-6 py-6 flex justify-between items-start pointer-events-none mix-blend-difference text-white">
      <div className="flex flex-col">
        <h1 className="text-4xl font-serif tracking-tighter leading-none pointer-events-auto cursor-default hover:italic transition-all">
          Velara
        </h1>
        <span className="text-[10px] font-mono tracking-[0.2em] opacity-60 mt-1">
          ISSUE_{new Date().getFullYear()}.{new Date().getMonth() + 1}.{new Date().getDate()}
        </span>
      </div>
      
      <div className="flex flex-col items-end pointer-events-auto">
        <div className="text-xl font-mono font-bold tracking-widest">
          {currentTime}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className={`w-2 h-2 rounded-full animate-pulse ${loading ? 'bg-red-500' : 'bg-[#ccff00]'}`}></span>
          <span className="text-[9px] uppercase tracking-widest opacity-80">
            {loading ? 'SYNCING...' : 'LIVE'}
          </span>
        </div>
      </div>
    </header>
  );

  const BackgroundMesh = () => (
    <div className="fixed inset-0 bg-[#050505] z-0 overflow-hidden pointer-events-none">
      {/* Abstract Gradient Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-gradient-to-b from-[#1a1a1a] to-transparent blur-[120px] opacity-40 animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[60vw] h-[60vw] rounded-full bg-[#111] blur-[80px] opacity-60" />
      
      {/* Texture & Lines */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]"></div>
      <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5"></div>
      <div className="absolute right-6 top-0 bottom-0 w-px bg-white/5"></div>
    </div>
  );

  const ArticleOverlay = ({ data, onClose }) => {
    const [scrolled, setScrolled] = useState(0);

    const handleScroll = (e) => {
      const element = e.target;
      const scrollTotal = element.scrollHeight - element.clientHeight;
      const scrollCurrent = element.scrollTop;
      setScrolled((scrollCurrent / scrollTotal) * 100);
    };

    // Safety check for color
    const safeColor = data.visualColor || "bg-[#ccff00]";
    const safeTextColor = safeColor.replace('bg-', 'text-');

    return (
      <div className="fixed inset-0 z-50 bg-[#050505] text-[#e0e0e0] flex flex-col animate-in slide-in-from-bottom duration-500 ease-out">
        {/* Scroll Progress Indicator */}
        <div className="w-full h-1 bg-white/5">
          <div 
            className={`h-full transition-all duration-100 ease-linear ${safeColor}`}
            style={{ width: `${scrolled}%` }}
          />
        </div>

        {/* Top Controls */}
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#050505]/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
             <div className={`w-3 h-3 rounded-sm ${safeColor}`} />
             <span className="font-mono text-xs text-white/40 tracking-wider">{data.tag || 'SYS.000'}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors group"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Content */}
        <div 
          className="flex-1 overflow-y-auto px-6 py-12 custom-scrollbar"
          onScroll={handleScroll}
        >
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-serif font-light leading-[0.95] tracking-tight mb-8 text-white">
              {data.headline}
            </h1>
            
            <div className="flex items-center justify-between border-y border-white/10 py-4 mb-12 font-mono text-[10px] md:text-xs uppercase tracking-widest text-white/40">
              <span>Read: {data.readTime || '03:00'}</span>
              <span>Theme: {data.sub || 'Analysis'}</span>
            </div>

            {/* Impact Statement Highlight */}
            <div className="mb-12 border-l-2 border-white/20 pl-6">
              <p className={`text-xl md:text-2xl font-light leading-relaxed ${safeTextColor}`}>
                {data.summary}
              </p>
            </div>

            {/* Main Philosophy */}
            <div className="prose prose-invert prose-lg md:prose-xl font-sans text-gray-400 leading-relaxed max-w-none">
               {data.content ? data.content.split('\n\n').map((para, i) => (
                 <p key={i} className="mb-8">{para}</p>
               )) : <p>Content unavailable.</p>}
            </div>

            {/* End Mark */}
            <div className="h-32 flex items-center justify-center opacity-20">
              <Disc className="w-6 h-6 animate-spin-slow" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FeedItem = ({ item, index }) => {
    // Safety checks for styling if API returns incomplete data
    const safeColor = item.visualColor || "bg-[#ccff00]";
    const safeTextColor = safeColor.replace('bg-', 'text-');

    return (
      <div 
        onClick={() => setActiveTab(item)}
        className="group relative w-full cursor-pointer border-t border-white/10 py-16 hover:bg-white/[0.02] transition-colors duration-500"
      >
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-8 px-2">
          {/* Visual Indicator */}
          <div className="hidden md:flex flex-col gap-2 w-32 font-mono text-xs text-white/30 group-hover:text-white transition-colors">
            <span>0{index + 1}</span>
            <span className={`h-px w-0 group-hover:w-full transition-all duration-700 ${safeColor}`}></span>
            <span>{item.tag || 'RAW'}</span>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h2 className="text-4xl md:text-6xl font-serif font-light leading-[0.95] mb-6 text-white group-hover:italic transition-all duration-500">
              {item.headline}
            </h2>
            
            <div className="flex justify-between items-end">
              <p className="text-sm md:text-base font-mono text-gray-500 max-w-xl leading-relaxed group-hover:text-gray-300 transition-colors">
                <span className={`mr-2 uppercase text-[10px] tracking-widest ${safeTextColor}`}>
                  [Takeaway]
                </span>
                {item.summary}
              </p>
              
              {/* Mobile Arrow */}
              <div className={`md:hidden w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-transparent transition-all ${safeColor} text-black`}>
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Desktop Arrow Interaction */}
          <div className="hidden md:flex w-24 justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-[-20px] group-hover:translate-x-0">
            <ArrowUpRight className={`w-16 h-16 ${safeTextColor}`} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-[#ccff00] selection:text-black ${mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
      <BackgroundMesh />
      <Header />

      {activeTab && <ArticleOverlay data={activeTab} onClose={() => setActiveTab(null)} />}

      <main className="relative pt-40 px-6 pb-20 max-w-6xl mx-auto z-10">
        
        {/* Intro */}
        <div className="mb-32 flex flex-col md:flex-row gap-8 items-start">
           <div className="w-px h-16 bg-gradient-to-b from-[#ccff00] to-transparent md:h-24" />
           <p className="font-mono text-xs md:text-sm text-gray-500 max-w-sm uppercase tracking-widest leading-relaxed">
             System 2.0 <br />
             Curated Insight Deck <br />
             Optimized for Biological Interfaces
           </p>
        </div>

        {/* The Stream */}
        <div className="flex flex-col min-h-[400px]">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-64 space-y-4">
               <div className="w-12 h-12 border-t-2 border-[#ccff00] rounded-full animate-spin"></div>
               <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">Establishing Link...</span>
             </div>
          ) : (
            newsData.map((item, i) => (
              <FeedItem key={item.id || i} item={item} index={i} />
            ))
          )}
        </div>

        {/* Minimal Footer */}
        <div className="mt-40 border-t border-white/10 pt-10 flex justify-between items-center text-white/20 text-[10px] font-mono uppercase tracking-widest">
          <span>Velara Protocol v2.6</span>
          <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse"></div>
        </div>

      </main>

      {/* Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}