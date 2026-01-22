import React, { useState } from 'react';

const EditCurriculumModal = ({ isOpen, onClose, skillTitle }) => {
  // --- logic: State for Curriculum Data ---
  const [chapters, setChapters] = useState([
    {
      id: Date.now(),
      title: "Design Foundations & Theory",
      lessons: ["Color Theory and Accessibility", "Typography Systems"]
    }
  ]);
  const [openSection, setOpenSection] = useState(null);

  if (!isOpen) return null;

  // --- logic: Handlers ---
  const addChapter = () => {
    const newChapter = {
      id: Date.now(),
      title: "New Chapter Title",
      lessons: ["New Lesson"]
    };
    setChapters([...chapters, newChapter]);
    setOpenSection(newChapter.id); // Naye chapter ko auto-expand karein
  };

  const addLesson = (chapterId) => {
    setChapters(chapters.map(ch => 
      ch.id === chapterId ? { ...ch, lessons: [...ch.lessons, "New Lesson"] } : ch
    ));
  };

  const deleteChapter = (id) => {
    setChapters(chapters.filter(ch => ch.id !== id));
  };

  const updateChapterTitle = (id, newTitle) => {
    setChapters(chapters.map(ch => ch.id === id ? { ...ch, title: newTitle } : ch));
  };

  const updateLessonText = (chapterId, lessonIdx, newText) => {
    setChapters(chapters.map(ch => {
      if (ch.id === chapterId) {
        const newLessons = [...ch.lessons];
        newLessons[lessonIdx] = newText;
        return { ...ch, lessons: newLessons };
      }
      return ch;
    }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm font-['Lexend']">
      <div className="bg-white dark:bg-[#112217] w-full max-w-2xl max-h-[90vh] rounded-3xl border border-slate-200 dark:border-[#23482f] shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-[#23482f] flex items-center justify-between bg-white dark:bg-[#193322]">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-2.5 rounded-xl">
              <span className="material-symbols-outlined text-primary text-2xl">edit_calendar</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Edit Curriculum</h2>
              <p className="text-slate-500 dark:text-[#92c9a4] text-sm">{skillTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#23482f] text-slate-400 hover:text-white transition-colors cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
          {chapters.map((chapter, index) => (
            <div key={chapter.id} className={`border border-slate-200 dark:border-[#23482f] rounded-2xl bg-slate-50/50 dark:bg-transparent overflow-hidden transition-all ${openSection === chapter.id ? 'border-primary/30' : ''}`}>
              {/* Chapter Header */}
              <div className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#193322]/30">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-primary font-bold text-sm">0{index + 1}.</span>
                  <input 
                    type="text" 
                    value={chapter.title}
                    onChange={(e) => updateChapterTitle(chapter.id, e.target.value)}
                    className="bg-transparent border-none text-slate-900 dark:text-white font-bold p-0 focus:ring-0 w-full outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => deleteChapter(chapter.id)} className="text-red-400 hover:text-red-500 p-1 cursor-pointer">
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                  <button onClick={() => setOpenSection(openSection === chapter.id ? null : chapter.id)} className="text-primary p-1 cursor-pointer">
                    <span className={`material-symbols-outlined transition-transform duration-300 ${openSection === chapter.id ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                </div>
              </div>

              {/* Lessons List */}
              <div className={`px-11 pb-5 pt-2 space-y-3 ${openSection === chapter.id ? 'block' : 'hidden'}`}>
                {chapter.lessons.map((lesson, lIdx) => (
                  <div key={lIdx} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400 text-sm">drag_indicator</span>
                    <input 
                      type="text" 
                      value={lesson}
                      onChange={(e) => updateLessonText(chapter.id, lIdx, e.target.value)}
                      className="flex-1 bg-white dark:bg-[#112217] border border-slate-200 dark:border-[#23482f] rounded-lg px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-primary"
                    />
                  </div>
                ))}
                <button 
                  onClick={() => addLesson(chapter.id)}
                  className="text-[#13ec5b] text-xs font-bold flex items-center gap-1 mt-2 hover:underline cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span> Add Lesson
                </button>
              </div>
            </div>
          ))}
          
          {/* Add Chapter Button */}
          <button 
            onClick={addChapter}
            className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-[#23482f] rounded-2xl text-slate-500 dark:text-[#92c9a4] font-bold hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined">library_add</span>
            Add New Chapter
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-[#23482f] flex justify-end gap-3 bg-white dark:bg-[#193322]">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-[#23482f] text-slate-600 dark:text-white font-semibold hover:bg-slate-50 dark:hover:bg-[#23482f] cursor-pointer">
            Discard
          </button>
          <button className="px-6 py-2.5 rounded-xl bg-primary text-background-dark font-bold hover:bg-primary/90 shadow-lg cursor-pointer">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCurriculumModal;