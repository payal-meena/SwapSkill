import React from 'react';
import { Link } from 'react-router-dom'; // Ensure react-router-dom is installed
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import SkillCard from '../../components/skills/SkillCard';

const steps = [
  { id: 1, title: "Create Profile", icon: "person_add", desc: "List the skills you have and the ones you want to learn." },
  { id: 2, title: "Find Match", icon: "travel_explore", desc: "Our algorithm finds experts who want to learn your skills." },
  { id: 3, title: "Send Request", icon: "send", desc: "Connect with your potential partner and propose a swap." },
  { id: 4, title: "Skill Swap", icon: "sync_alt", desc: "Join a session and start exchanging knowledge for free." },
  { id: 5, title: "Build Rep", icon: "verified", desc: "Earn ratings and become a certified expert in the community." },
];

function Home() {
  // Function to handle smooth scroll
  const scrollToHowItWorks = () => {
    const section = document.getElementById('how-it-works');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen transition-colors duration-300">
      <div className="max-w-[1700px] mx-auto px-4 md:px-10 py-5">
        <Navbar />

        <main className="mt-8">
          {/* --- HERO SECTION (Banner) --- */}
          <section id='hero' className="relative min-h-[650px] flex flex-col items-center justify-center rounded-[50px] overflow-hidden p-8 border border-white/10 shadow-2xl">

            {/* Background Image with advanced overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070"
                className="w-full h-full object-cover"
                alt="Community background"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#0a140e]/90 to-[#0a140e]"></div>

              {/* Decorative Glow Blobs */}
              <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 blur-[120px] rounded-full"></div>
              <div className="absolute bottom-0 -right-20 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10 flex flex-col gap-8 text-center max-w-5xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
              {/* Badge */}
              <div className="inline-flex self-center items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-primary text-xs md:text-sm font-bold uppercase tracking-widest shadow-xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                The Future of Collaborative Learning
              </div>

              <h1 className="text-white text-5xl font-black leading-tight md:text-7xl lg:text-9xl tracking-tighter">
                Exchange Skills. <br />
                <span className="text-primary ">
                  Grow Together.
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                  </svg>
                </span>
              </h1>

              <h2 className="text-slate-300 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed font-light">
                Join 50,000+ members swapping expertise. No credit cards, no hidden fees—just pure, human-to-human knowledge.
              </h2>

              <div className="flex flex-wrap justify-center gap-6 mt-6">
                {/* Button 1: To Login */}
                <Link to="/auth" className="bg-primary text-background-dark font-black px-12 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(74,222,128,0.4)] text-lg flex items-center gap-2">
                  Join the Swap <span className="material-symbols-outlined">rocket_launch</span>
                </Link>

                {/* Button 2: How it works scroll */}
                <button
                  onClick={scrollToHowItWorks}
                  className="bg-white/5 backdrop-blur-xltext-white border border-white/20 font-bold px-12 py-5 rounded-2xl hover:bg-white/10 hover:border-white/40 transition-all text-lg"
                >
                  See How it Works
                </button>
              </div>
            </div>
          </section>

          {/* --- HOW IT WORKS SECTION --- */}
          <section className="mt-40 mb-20 px-4" id='how-it-works'>
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                How SwapSkill Works
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                We've built a seamless ecosystem to connect curious minds and skilled mentors without any financial barriers.
              </p>
            </div>

            {/* Container ki width thodi badha di hai (max-w-7xl) taaki bade boxes fit ho sakein */}
            <div className="relative max-w-7xl mx-auto min-h-[1000px] flex flex-col items-center">

              {/* Box 1: Learn Smarter */}
              <div className="lg:absolute lg:top-0 lg:left-0 flex flex-col md:flex-row items-center gap-10 mb-20 lg:mb-0">
                {/* max-w-xl use kiya hai width badhane ke liye */}
                <div className="bg-white dark:bg-[#12261a] border border-slate-200 dark:border-primary/20 p-10 rounded-[40px] shadow-2xl max-w-xl hover:border-primary transition-all duration-500 group">
                  <div className="w-16 h-9 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-background-dark transition-all">
                    <span className="material-symbols-outlined text-4xl">local_library</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Learn Smarter</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
                    Connect with real experts for 1-on-1 sessions. Skip the expensive courses and learn through direct interaction and practical advice.
                  </p>
                  <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
                    Expert Guidance <span className="material-symbols-outlined text-sm">verified</span>
                  </div>
                </div>
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/boy-reading-book-and-searching-for-new-ideas-4488749-3738462.png" className="w-56 h-56 object-contain hidden lg:block drop-shadow-2xl animate-bounce-slow" alt="Learning illustration" />
              </div>

              {/* Box 2: Share Expertise */}
              <div className="lg:absolute lg:top-1/2 lg:right-0 lg:-translate-y-1/2 flex flex-col md:flex-row-reverse items-center gap-10 mb-20 lg:mb-0">
                {/* max-w-xl use kiya hai width badhane ke liye */}
                <div className="bg-white dark:bg-[#12261a] border border-slate-200 dark:border-primary/20 p-10 rounded-[40px] shadow-2xl max-w-xl hover:border-primary transition-all duration-500 group">
                  <div className="w-16 h-9 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-background-dark transition-all">
                    <span className="material-symbols-outlined text-4xl">co_present</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Share Expertise</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
                    Your hobby or profession is someone else's dream skill. Teach what you love and build your authority while helping others grow.
                  </p>
                  <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
                    Build Your Legacy <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  </div>
                </div>
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/teacher-giving-lecture-on-webinar-4488755-3738468.png" className="w-56 h-56 object-contain hidden lg:block drop-shadow-2xl" alt="Expertise illustration" />
              </div>

              {/* Box 3: Zero Cost */}
              <div className="lg:absolute lg:bottom-0 lg:left-0 flex flex-col md:flex-row items-center gap-10">
                {/* max-w-xl use kiya hai width badhane ke liye */}
                <div className="bg-white dark:bg-[#12261a] border border-slate-200 dark:border-primary/20 p-10 rounded-[40px] shadow-2xl max-w-xl hover:border-primary transition-all duration-500 group">
                  <div className="w-16 h-9 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-background-dark transition-all">
                    <span className="material-symbols-outlined text-4xl">volunteer_activism</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Zero Cost Learning</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
                    We believe education should be free. By swapping skills, you bypass the paywalls and join a self-sustaining economy of knowledge.
                  </p>
                  <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
                    Pure Exchange <span className="material-symbols-outlined text-sm">currency_exchange</span>
                  </div>
                </div>
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/business-deal-4488734-3738447.png" className="w-56 h-56 object-contain hidden lg:block drop-shadow-2xl" alt="Collaboration illustration" />
              </div>
            </div>
            {/* 5 Process Steps */}
            <div className="mt-52">
              <h3 className="text-4xl font-black text-center mb-16 text-slate-900 dark:text-white uppercase tracking-tighter">
                Simple Steps to Success
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                {steps.map((step) => (
                  <div key={step.id} className="group relative bg-white dark:bg-[#12261a]/40 border border-slate-200 dark:border-white/5 rounded-[30px] p-8 text-center hover:bg-primary/5 transition-all duration-500 hover:-translate-y-2">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary text-background-dark font-black text-xl mb-6 shadow-xl shadow-primary/20">
                      {step.id}
                    </div>
                    <div className="flex justify-center mb-6">
                      <span className="material-symbols-outlined text-primary text-5xl group-hover:scale-110 transition-transform duration-300">{step.icon}</span>
                    </div>
                    <h4 className="font-bold text-xl text-slate-900 dark:text-white mb-3 tracking-tight">{step.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Philosophy/Stats Section */}
          <section id="about" className="mt-32 px-4 scroll-mt-24 pb-32">
            <div className="bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-[60px] p-10 md:p-24 border border-primary/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[120px] rounded-full"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="flex flex-col gap-8 relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold w-fit uppercase tracking-widest">
                    Our Philosophy
                  </div>
                  <h2 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.05]">
                    Knowledge is the only currency you need.
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-xl leading-relaxed font-light">
                    We are building a world where money never stops someone from growing. SwapSkill is a movement to make education free, human, and accessible for everyone.
                  </p>
                  <div className="flex gap-12 mt-4">
                    <div>
                      <h4 className="text-primary text-5xl md:text-6xl font-black mb-1">50k+</h4>
                      <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Global Users</p>
                    </div>
                    <div>
                      <h4 className="text-primary text-5xl md:text-6xl font-black mb-1">100%</h4>
                      <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Free Learning</p>
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-[40px] opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071"
                    alt="Collaboration"
                    className="relative w-full h-[550px] object-cover rounded-[50px] shadow-2xl transition-all duration-700 group-hover:scale-[1.03]"
                  />
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default Home;