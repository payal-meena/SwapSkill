import React, { useState, useEffect } from 'react';
import { connectionService } from '../../services/connectionService';

const MyConnection = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await connectionService.getMyConnections();
      if (response.success) {
        setConnections(response.connections);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-['Lexend']">
      <main className="flex-1 flex flex-col overflow-y-auto scrollbar-hide bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto w-full px-6 py-10">
          <div className="text-center mb-10">
            <h1 className="text-slate-900 dark:text-white text-3xl font-black uppercase tracking-tight">
              My Connections
            </h1>
            <p className="text-[#13ec5b] text-[10px] font-black tracking-[0.2em] mt-1">
              MANAGE YOUR SKILL EXCHANGE NETWORK
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="size-12 border-4 border-[#13ec5b]/20 border-t-[#13ec5b] rounded-full animate-spin" />
            </div>
          ) : connections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connections.map((connection) => (
                <div
                  key={connection._id}
                  className="bg-white dark:bg-[#112217] border border-slate-200 dark:border-[#23482f] rounded-2xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-full bg-[#13ec5b]/10 flex items-center justify-center overflow-hidden">
                      {connection.profileImage ? (
                        <img src={connection.profileImage} alt={connection.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-[#13ec5b] text-3xl">person</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-slate-900 dark:text-white font-bold text-lg">{connection.name}</h3>
                      {connection.profession && (
                        <p className="text-slate-500 dark:text-slate-400 text-sm">{connection.profession}</p>
                      )}
                    </div>
                  </div>
                  {connection.bio && (
                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-4 line-clamp-2">{connection.bio}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-[#23482f] rounded-3xl">
              <span className="material-symbols-outlined text-[#13ec5b]/40 text-6xl mb-4">group_off</span>
              <p className="text-slate-500 dark:text-[#92c9a4]/40 font-black uppercase text-xs tracking-widest">
                No connections yet
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyConnection;
