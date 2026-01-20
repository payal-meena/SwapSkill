import React from 'react';
import MySkillCard from '../../components/skills/MySkillCard'; 
import Sidebar from '../../components/common/UserSidebar'; 
import UserNavbar from '../../components/common/UserNavbar'; 

const MySkills = () => {
  const offeredSkills = [
    { title: "UI/UX Design", level: "Advanced", icon: "brush", detail: "12 students taught", status: "Active" },
    { title: "React Development", level: "Intermediate", icon: "code", detail: "5 students taught", status: "Active" },
    { title: "Spanish Language", level: "Advanced", icon: "translate", detail: "Native Speaker", status: "Paused" },
  ];

  const wantedSkills = [
    { title: "Python Programming", level: "Beginner", icon: "data_object", detail: "3 active matches", status: "Searching for partners" },
    { title: "Piano", level: "Beginner", icon: "piano", detail: "0 matches", status: "Pending verification" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      
      <main className="flex-1 flex flex-col overflow-y-auto bg-background-light dark:bg-background-dark">
        <UserNavbar userName="Alex" />

        <div className="p-8 max-w-[1200px] mx-auto w-full">
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined">school</span>
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white text-xl font-bold">Skills I Offer</h3>
                <p className="text-slate-500 dark:text-[#92c9a4] text-sm">Skills you are teaching to others</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offeredSkills.map((skill, index) => (
                <MySkillCard key={index} {...skill} isOffer={true} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined">auto_stories</span>
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white text-xl font-bold">Skills I Want to Learn</h3>
                <p className="text-slate-500 dark:text-[#92c9a4] text-sm">Skills you're looking for partners</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wantedSkills.map((skill, index) => (
                <MySkillCard key={index} {...skill} isOffer={false} />
              ))}
              
              <button className="border-2 border-dashed border-slate-200 dark:border-[#23482f] rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-primary hover:text-primary transition-all group cursor-pointer">
                <span className="material-symbols-outlined text-4xl mb-2 group-hover:scale-110 transition-transform">add_circle</span>
                <span className="font-bold">Add Wanted Skill</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MySkills;