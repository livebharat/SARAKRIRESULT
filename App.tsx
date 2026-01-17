
import React, { useState, useEffect } from 'react';
import { JobPost, JobCategory } from './types';
import { generateJobContent } from './services/geminiService';
import { SarkariTable } from './components/SarkariTable';

const App: React.FC = () => {
  const [posts, setPosts] = useState<JobPost[]>([]);
  const [view, setView] = useState<'public' | 'admin' | 'detail'>('public');
  const [selectedPost, setSelectedPost] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(false);

  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // AI Input
  const [aiInput, setAiInput] = useState('');
  const [manualCategory, setManualCategory] = useState<JobCategory>(JobCategory.LATEST_JOB);

  // Load Data
  useEffect(() => {
    const saved = localStorage.getItem('master_sarkari_v3');
    if (saved) setPosts(JSON.parse(saved));
    if (sessionStorage.getItem('admin_auth') === 'true') setIsAuthenticated(true);
  }, []);

  const savePosts = (newPosts: JobPost[]) => {
    setPosts(newPosts);
    localStorage.setItem('master_sarkari_v3', JSON.stringify(newPosts));
  };

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
    } else {
      alert('गलत पासवर्ड! (पासवर्ड है: admin123)');
    }
  };

  const handleAiGenerate = async () => {
    if (!aiInput) return alert('जॉब का नाम लिखें!');
    setLoading(true);
    try {
      const { data } = await generateJobContent(aiInput);
      const newPost: JobPost = {
        id: Date.now().toString(),
        category: manualCategory,
        title: data.title,
        shortDescription: data.shortDescription,
        importantDates: data.importantDates,
        applicationFee: data.applicationFee,
        ageLimit: data.ageLimit,
        vacancyDetails: data.vacancyDetails,
        eligibility: data.eligibility,
        howToApply: data.howToApply,
        usefulLinks: {
          applyOnline: data.applyOnlineLink,
          downloadNotification: data.notificationLink,
          officialWebsite: data.officialWebsiteLink
        },
        createdAt: Date.now()
      };
      savePosts([newPost, ...posts]);
      setAiInput('');
      alert('पोस्ट लाइव हो गई है! ✅ अब यह होम पेज पर दिखाई देगी।');
    } catch (error) {
      alert('लिंक नहीं मिल पाए, कृपया नाम सही लिखें और फिर से कोशिश करें।');
    } finally {
      setLoading(false);
    }
  };

  const copyBloggerHTML = (post: JobPost) => {
    const html = `<!-- SARKARI RESULT AI POST START -->
<div style="font-family: Arial, sans-serif; border: 5px solid #000; padding: 0; max-width: 850px; margin: auto; background: #fff;">
    <div style="background: #ff0000; color: #fff; padding: 25px; text-align: center; border-bottom: 5px solid #ffeb3b;">
        <h1 style="margin: 0; font-size: 30px; font-weight: 900;">${post.title}</h1>
    </div>
    <div style="padding: 20px;">
        <div style="background: #fffde7; padding: 20px; border: 2px dashed #fbc02d; margin-bottom: 25px;">
            <h3 style="color: #d32f2f; margin: 0 0 10px; border-bottom: 3px solid #d32f2f; display: inline-block; font-size: 22px;">Short Description:</h3>
            <p style="margin: 0; font-weight: bold; font-size: 16px; line-height: 1.8;">${post.shortDescription}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; border: 4px solid #000;" border="1">
            <tr style="background: #ff0000; color: #fff;"><th colspan="2" style="padding: 15px; font-size: 22px;">Important Dates & Fee Details</th></tr>
            <tr><td style="padding: 12px; font-weight: 900; background: #f5f5f5; color: #0000cc; width: 35%;">Important Dates</td><td style="padding: 12px; font-weight: 900; color: #d32f2f;">${post.importantDates}</td></tr>
            <tr><td style="padding: 12px; font-weight: 900; background: #f5f5f5; color: #0000cc;">Application Fee</td><td style="padding: 12px; font-weight: 900;">${post.applicationFee}</td></tr>
            <tr><td style="padding: 12px; font-weight: 900; background: #f5f5f5; color: #0000cc;">Age Limit</td><td style="padding: 12px; font-weight: 900;">${post.ageLimit}</td></tr>
        </table>
        <div style="border: 4px solid #0000cc; padding: 25px; margin-bottom: 25px; background: #e3f2fd;">
            <h3 style="color: #0000cc; font-size: 20px; font-weight: 900; text-decoration: underline;">Vacancy & Eligibility:</h3>
            <p style="font-weight: 900; color: #d32f2f; font-size: 18px; margin: 15px 0;">${post.vacancyDetails}</p>
            <p style="font-weight: 900; font-size: 16px; background: #fff; padding: 10px;">Eligibility: ${post.eligibility}</p>
        </div>
        <div style="background: #fdf2f2; padding: 25px; border-left: 10px solid #ff0000; margin-bottom: 25px;">
            <h3 style="color: #ff0000; margin: 0 0 15px; font-weight: 900; font-size: 22px;">How to Fill Form (Hindi):</h3>
            <p style="white-space: pre-wrap; font-weight: bold; font-size: 16px; line-height: 1.8;">${post.howToApply}</p>
        </div>
        <div style="text-align: center; background: #222; padding: 30px; border: 4px solid #000;">
            <h3 style="color: #ffeb3b; font-size: 24px; font-weight: 900; text-decoration: underline;">Important Links</h3>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-top: 20px;">
                <a href="${post.usefulLinks.applyOnline}" style="background: #4caf50; color: #fff; padding: 15px 30px; text-decoration: none; font-weight: 900; border-radius: 5px; font-size: 18px;">APPLY ONLINE</a>
                <a href="${post.usefulLinks.downloadNotification}" style="background: #2196f3; color: #fff; padding: 15px 30px; text-decoration: none; font-weight: 900; border-radius: 5px; font-size: 18px;">NOTIFICATION</a>
            </div>
        </div>
    </div>
</div>
<!-- SARKARI RESULT AI POST END -->`;
    navigator.clipboard.writeText(html);
    alert('Blogger Post HTML कॉपी हो गया! अब इसे Blogger के HTML View में पेस्ट करें।');
  };

  const renderNavbar = () => (
    <nav className="bg-blue-900 text-white sticky top-0 z-50 shadow-2xl border-b-4 border-yellow-400">
      <div className="max-w-[1300px] mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setView('public'); setSelectedPost(null); }}>
          <div className="bg-red-600 text-white px-3 py-1 font-black italic rounded text-xl shadow-lg">SR</div>
          <span className="font-black text-xl md:text-2xl uppercase tracking-tighter">Sarkari Result AI</span>
        </div>
        <div className="flex gap-4 md:gap-8 font-black uppercase text-xs md:text-sm">
          <button onClick={() => { setView('public'); setSelectedPost(null); }} className="hover:text-yellow-400">Home</button>
          <button onClick={() => setView('admin')} className="bg-red-600 px-4 py-2 rounded hover:bg-white hover:text-red-600 transition shadow-lg">Admin Master</button>
        </div>
      </div>
    </nav>
  );

  const renderPublicView = () => (
    <div className="max-w-[1300px] mx-auto bg-white min-h-screen border-x-4 border-gray-200">
      {/* Brand Header */}
      <div className="bg-[#ff0000] py-10 px-4 text-center border-b-8 border-yellow-400">
        <h1 className="text-4xl md:text-8xl font-black text-white italic tracking-tighter uppercase drop-shadow-2xl">SARKARI RESULT AI</h1>
        <p className="text-yellow-300 text-sm md:text-2xl font-black mt-2 uppercase tracking-widest italic">India's No. 1 Job Portal (AI Search Engine)</p>
      </div>

      {/* Breaking News */}
      <div className="bg-blue-900 py-3 border-y-2 border-black flex items-center overflow-hidden">
        <div className="bg-yellow-400 px-6 py-1 font-black text-black text-xs mr-4 z-10 shrink-0 italic shadow-lg">LATEST</div>
        <div className="animate-marquee whitespace-nowrap text-white font-black text-lg">
          {posts.length > 0 ? posts.map(p => (
            <span key={p.id} className="mx-16 cursor-pointer hover:text-yellow-400" onClick={() => { setSelectedPost(p); setView('detail'); }}>
              {p.title} ⚡ 
            </span>
          )) : "AI is searching for new jobs... Keep Refreshing!"}
        </div>
      </div>

      {/* Job Grid Boxes */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-100">
        {[JobCategory.RESULT, JobCategory.ADMIT_CARD, JobCategory.LATEST_JOB].map(cat => (
          <div key={cat} className="flex flex-col h-[650px] border-4 border-blue-900 rounded-lg bg-white shadow-2xl overflow-hidden">
            <div className="bg-blue-900 text-white p-4 font-black text-center text-2xl uppercase border-b-4 border-yellow-400 italic">{cat}</div>
            <div className="p-2 overflow-y-auto flex-1 custom-scrollbar">
              {posts.filter(p => p.category === cat).map(p => (
                <button key={p.id} onClick={() => { setSelectedPost(p); setView('detail'); }} className="w-full text-left py-4 px-4 border-b border-gray-100 text-[#0000cc] font-black text-sm md:text-md hover:bg-blue-50 transition flex items-start gap-3 group">
                  <span className="mt-2 w-3 h-3 bg-red-600 rounded-full shrink-0 shadow-sm" /> 
                  <span className="group-hover:underline">{p.title}</span>
                </button>
              ))}
              {posts.filter(p => p.category === cat).length === 0 && (
                <div className="p-20 text-center text-gray-400 font-bold italic opacity-40 uppercase">Updating {cat}...</div>
              )}
            </div>
            <div className="bg-gray-100 p-2 text-center text-[10px] font-bold text-gray-500 uppercase">View All</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 text-white p-12 text-center border-t-8 border-red-600 mt-10">
        <h2 className="text-3xl font-black italic text-red-500 mb-6 uppercase">Sarkari Result AI Master</h2>
        <p className="max-w-3xl mx-auto text-gray-400 font-bold text-lg mb-8 leading-relaxed">
          The most advanced AI portal for government exams. We provide results, admit cards, and latest job forms with 100% verified links.
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={() => setView('admin')} className="bg-red-600 px-8 py-4 rounded-xl font-black uppercase text-xl hover:bg-white hover:text-red-600 transition shadow-2xl">Go to Admin Master</button>
        </div>
      </div>
    </div>
  );

  const renderAdminView = () => {
    if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-[80vh] bg-slate-200 p-4">
          <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border-t-8 border-red-600 text-center">
            <h2 className="text-3xl font-black text-blue-900 mb-8 uppercase italic">Secure Admin Panel</h2>
            <input type="password" placeholder="Password (admin123)" className="w-full p-4 border-4 rounded-xl mb-6 font-black text-center text-xl outline-none focus:border-blue-900 transition" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
            <button onClick={handleLogin} className="w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase text-xl hover:bg-blue-900 shadow-xl transition active:scale-95">Login Master</button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="bg-green-600 text-white p-6 rounded-2xl mb-8 shadow-2xl flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-black uppercase italic">वेबसाइट को लाइव कैसे करें? 🌐</h3>
            <p className="font-bold text-sm text-green-100">इस कोड को Vercel या Netlify पर होस्ट करें। फिर यहाँ जॉब बनायें और "Copy Blogger HTML" बटन दबाकर Blogger में पोस्ट करें।</p>
          </div>
          <div className="bg-white text-green-700 px-6 py-2 rounded-full font-black text-xs uppercase animate-pulse mt-4 md:mt-0">HINDI MASTER GUIDE</div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border-t-8 border-red-600 h-fit">
            <h3 className="text-2xl font-black mb-8 uppercase text-red-600 underline italic">Generate Full AI Job Post</h3>
            <div className="space-y-8">
              <select value={manualCategory} onChange={e => setManualCategory(e.target.value as JobCategory)} className="w-full p-4 border-2 rounded-xl font-black text-lg outline-none focus:border-red-600">
                {Object.values(JobCategory).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea rows={4} value={aiInput} onChange={e => setAiInput(e.target.value)} placeholder="जॉब का नाम यहाँ लिखें (Ex: SSC CGL 2025 New Form)" className="w-full p-5 border-2 rounded-xl font-black text-xl outline-none focus:border-red-600 shadow-inner" />
              <button onClick={handleAiGenerate} disabled={loading} className={`w-full py-6 rounded-2xl font-black uppercase shadow-2xl text-2xl transition-all ${loading ? 'bg-gray-400 animate-pulse' : 'bg-red-600 hover:bg-black text-white active:scale-95'}`}>
                {loading ? 'AI खोज रहा है... (Wait 10s)' : 'GENERATE MASTER POST 🚀'}
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-2xl border-t-8 border-blue-900 flex flex-col">
            <h3 className="text-2xl font-black mb-8 uppercase text-blue-900 italic flex justify-between border-b pb-4">Live Database ({posts.length})</h3>
            <div className="overflow-y-auto max-h-[700px] space-y-5 pr-3 custom-scrollbar">
              {posts.map(p => (
                <div key={p.id} className="p-6 border-2 border-gray-100 rounded-2xl bg-slate-50 hover:border-blue-500 transition shadow-sm relative group">
                  <div className="font-black text-md text-gray-800 mb-6 uppercase leading-tight">{p.title}</div>
                  <div className="flex gap-3 flex-wrap">
                    <button onClick={() => { setSelectedPost(p); setView('detail'); }} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-black text-xs uppercase shadow hover:scale-105 transition">View Live</button>
                    <button onClick={() => copyBloggerHTML(p)} className="bg-green-600 text-white px-5 py-2 rounded-lg font-black text-xs uppercase shadow hover:scale-105 transition italic">📄 COPY BLOGGER CODE</button>
                    <button onClick={() => savePosts(posts.filter(x => x.id !== p.id))} className="bg-red-600 text-white px-5 py-2 rounded-lg font-black text-xs uppercase shadow hover:bg-black transition">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDetailView = () => {
    if (!selectedPost) return null;
    return (
      <div className="max-w-5xl mx-auto bg-white p-4 md:p-12 min-h-screen border-x-8 border-red-700 shadow-2xl">
        <div className="flex justify-between items-center mb-10 pb-8 border-b-2">
          <button onClick={() => { setView('public'); setSelectedPost(null); }} className="bg-blue-900 text-white px-8 py-3 rounded-xl font-black uppercase text-sm italic shadow-lg hover:bg-red-600 transition">← BACK TO HOME</button>
          <button onClick={() => copyBloggerHTML(selectedPost)} className="bg-green-600 text-white px-8 py-4 rounded-xl font-black uppercase text-sm shadow-2xl hover:scale-105 transition flex items-center gap-2 border-b-8 border-green-900">
            📄 COPY FOR BLOGGER
          </button>
        </div>
        
        <div className="bg-red-600 text-white p-14 text-center text-2xl md:text-5xl font-black uppercase mb-16 border-4 border-black shadow-2xl italic rounded-xl leading-tight">
          {selectedPost.title}
        </div>

        <div className="mb-14 bg-yellow-50 p-10 border-4 border-red-600 rounded-[40px] shadow-inner">
          <h3 className="text-red-700 font-black mb-6 text-3xl underline uppercase italic tracking-tighter">संक्षिप्त विवरण (Hindi):</h3>
          <p className="text-xl leading-loose text-gray-800 font-bold whitespace-pre-wrap">{selectedPost.shortDescription}</p>
        </div>

        <SarkariTable title="Important Dates & Application Fee" data={[
          { label: 'महत्वपूर्ण तिथियां', value: selectedPost.importantDates },
          { label: 'आवेदन शुल्क', value: selectedPost.applicationFee },
          { label: 'आयु सीमा', value: selectedPost.ageLimit }
        ]} />
        
        <div className="my-14 p-10 bg-blue-50 border-x-8 border-blue-900 rounded-3xl shadow-xl">
           <h3 className="text-3xl font-black text-blue-900 underline uppercase mb-8 italic">रिक्तियों का विवरण (Details):</h3>
           <p className="text-xl text-gray-800 font-black whitespace-pre-wrap leading-relaxed">{selectedPost.vacancyDetails}</p>
        </div>

        <SarkariTable title="Eligibility & Qualification" data={[
          { label: 'पात्रता (Eligibility)', value: selectedPost.eligibility }
        ]} />
        
        <div className="mb-20 p-12 border-4 border-blue-900 bg-white rounded-[50px] shadow-2xl">
          <h3 className="text-blue-900 font-black mb-10 text-4xl text-center underline italic uppercase">How to Fill (Hindi Guide):</h3>
          <p className="text-xl text-gray-800 leading-loose font-bold whitespace-pre-wrap">{selectedPost.howToApply}</p>
        </div>

        <div className="bg-slate-900 p-12 border-[10px] border-double border-red-600 mb-20 rounded-[60px] text-center shadow-2xl">
           <h3 className="text-yellow-400 font-black text-4xl uppercase underline mb-14 italic tracking-tighter">Verified Official Links</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <a href={selectedPost.usefulLinks.applyOnline} target="_blank" className="p-10 bg-green-600 text-white font-black text-center text-3xl hover:bg-green-700 transition shadow-2xl rounded-2xl border-b-[12px] border-green-900 active:translate-y-2 active:border-b-0 uppercase italic">Online Apply</a>
              <a href={selectedPost.usefulLinks.downloadNotification} target="_blank" className="p-10 bg-blue-600 text-white font-black text-center text-3xl hover:bg-blue-800 transition shadow-2xl rounded-2xl border-b-[12px] border-blue-900 active:translate-y-2 active:border-b-0 uppercase italic">Notification</a>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-200 custom-scrollbar selection:bg-red-600 selection:text-white pb-10">
      {renderNavbar()}
      <div>
        {view === 'public' && renderPublicView()}
        {view === 'admin' && renderAdminView()}
        {view === 'detail' && renderDetailView()}
      </div>
    </div>
  );
};

export default App;
