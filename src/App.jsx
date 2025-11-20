import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Code, Plus, Lock, Unlock, Zap, Globe, Database, Cpu, Eye, X } from 'lucide-react';

// Utility untuk efek suara (dummy function untuk visual logic)
const playSound = (type) => {
  // Dalam aplikasi nyata, kita bisa memasukkan Audio() di sini
  console.log(`Playing sound: ${type}`);
};

const App = () => {
  // --- STATE MANAGEMENT ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [logs, setLogs] = useState(['Initializing system...', 'Connecting to secure server...', 'Access restricted.']);
  
  // Data awal tools
  const initialTools = [
    { id: 1, name: 'IP Tracer', desc: 'Track geolocation data packets.', url: '#', icon: 'globe', category: 'Network' },
    { id: 2, name: 'Payload Generator', desc: 'Create custom exploit payloads.', url: '#', icon: 'code', category: 'Exploit' },
    { id: 3, name: 'Port Scanner', desc: 'Analyze open ports on target.', url: '#', icon: 'zap', category: 'Recon' },
    { id: 4, name: 'Hash Decryptor', desc: 'Brute-force hash algorithms.', url: '#', icon: 'shield', category: 'Crypto' },
  ];

  const [tools, setTools] = useState(() => {
    const saved = localStorage.getItem('hacker_tools');
    return saved ? JSON.parse(saved) : initialTools;
  });

  // State untuk form tambah tool
  const [newTool, setNewTool] = useState({ name: '', desc: '', category: 'General' });

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem('hacker_tools', JSON.stringify(tools));
  }, [tools]);

  // --- HANDLERS ---
  const addLog = (text) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [`[${timestamp}] ${text}`, ...prev].slice(0, 5));
  };

  const handleSecretCode = (e) => {
    const val = e.target.value;
    setSecretCode(val);
    
    // HARDCODED SECRET PASSWORD: 'root' atau 'admin'
    if (val.toLowerCase() === 'root' || val.toLowerCase() === 'admin') {
      if (!isAdmin) {
        setIsAdmin(true);
        addLog('ACCESS GRANTED: ADMIN PRIVILEGES UNLOCKED');
        playSound('success');
      }
    } else {
      if (isAdmin && val.length < 4) {
        setIsAdmin(false);
        addLog('SESSION TERMINATED: USER LOGGED OUT');
      }
    }
  };

  const handleAddTool = (e) => {
    e.preventDefault();
    if (!newTool.name || !newTool.desc) return;

    const tool = {
      id: Date.now(),
      ...newTool,
      url: '#',
      icon: 'database'
    };

    setTools([...tools, tool]);
    setShowModal(false);
    setNewTool({ name: '', desc: '', category: 'General' });
    addLog(`SYSTEM UPDATE: New tool module '${tool.name}' loaded.`);
  };

  const handleDeleteTool = (id, name) => {
    setTools(tools.filter(t => t.id !== id));
    addLog(`DELETE: Tool module '${name}' removed from registry.`);
  };

  // Helper ikon
  const getIcon = (name) => {
    switch(name) {
      case 'globe': return <Globe size={24} />;
      case 'code': return <Code size={24} />;
      case 'zap': return <Zap size={24} />;
      case 'shield': return <Shield size={24} />;
      case 'database': return <Database size={24} />;
      default: return <Cpu size={24} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono selection:bg-green-900 selection:text-white overflow-x-hidden relative">
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}>
      </div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black"></div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 py-6 flex flex-col min-h-screen">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-green-800/50 pb-6">
          <div className="mb-4 md:mb-0 animate-pulse">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter flex items-center gap-2">
              <Terminal className="w-8 h-8 md:w-12 md:h-12" />
              NEXUS<span className="text-white">_HUB</span>
            </h1>
            <p className="text-xs md:text-sm opacity-70 mt-1 text-green-400">
              SECURE ENVIRONMENT // V.2.0.4 // CONNECTED
            </p>
          </div>

          {/* SECRET BOX AREA */}
          <div className="relative group w-full md:w-auto">
            <div className="absolute -inset-1 bg-green-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
            <div className="relative bg-black border border-green-700 rounded p-2 flex items-center gap-2">
              {isAdmin ? <Unlock size={16} className="text-green-400" /> : <Lock size={16} className="text-red-500" />}
              <span className="text-xs text-gray-500 mr-1">CMD:</span>
              <input 
                type="text" 
                value={secretCode}
                onChange={handleSecretCode}
                placeholder="ENTER PASSKEY"
                className="bg-transparent border-none outline-none text-green-400 placeholder-green-900 text-sm w-32 uppercase focus:w-48 transition-all duration-300"
              />
              <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-green-500 animate-ping' : 'bg-red-900'}`}></div>
            </div>
            {isAdmin && (
              <div className="absolute right-0 top-full mt-2 text-xs text-green-300 bg-green-900/20 px-2 py-1 rounded border border-green-800">
                Welcome back, Administrator.
              </div>
            )}
          </div>
        </header>

        {/* ADMIN CONTROLS */}
        {isAdmin && (
          <div className="mb-8 p-4 border border-green-500/50 bg-green-900/10 rounded-lg flex justify-between items-center backdrop-blur-sm animate-fade-in-down">
            <div>
              <h3 className="text-lg font-bold text-white">ADMIN CONSOLE</h3>
              <p className="text-xs text-green-400">System Override Active. You may inject new modules.</p>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black px-4 py-2 rounded font-bold transition-all hover:shadow-[0_0_15px_rgba(34,197,94,0.6)]"
            >
              <Plus size={18} /> INJECT TOOL
            </button>
          </div>
        )}

        {/* TOOLS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-auto">
          {tools.map((tool) => (
            <div 
              key={tool.id} 
              className="group relative bg-black border border-green-900 hover:border-green-400 p-6 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Hover Glow */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-green-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-green-900/20 rounded border border-green-800 text-green-400 group-hover:text-white group-hover:bg-green-600 transition-colors">
                    {getIcon(tool.icon)}
                  </div>
                  {isAdmin && (
                    <button 
                      onClick={() => handleDeleteTool(tool.id, tool.name)}
                      className="text-red-900 hover:text-red-500 transition-colors"
                      title="Purge Module"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-gray-100 group-hover:text-green-400 transition-colors">{tool.name}</h3>
                  <span className="text-[10px] border border-green-900 px-1 py-0.5 rounded text-green-700 uppercase">{tool.category}</span>
                </div>
                <p className="text-sm text-gray-500 mb-6 h-10 line-clamp-2 group-hover:text-gray-400 transition-colors">
                  {tool.desc}
                </p>
                <a 
                  href={tool.url} 
                  onClick={() => addLog(`EXEC: Initiating ${tool.name} sequence...`)}
                  className="inline-flex items-center text-sm font-bold text-green-600 group-hover:text-white group-hover:underline decoration-green-500 underline-offset-4 transition-all"
                >
                  &gt; EXECUTE_PROGRAM
                </a>
              </div>
              
              {/* Decorative Corners */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>

        {/* FOOTER / LOG CONSOLE */}
        <footer className="mt-12 border-t border-green-900 pt-6">
          <div className="bg-black border border-green-900/50 p-4 font-mono text-xs h-32 overflow-hidden relative shadow-inner rounded">
            <div className="absolute top-2 right-2 text-green-800 flex items-center gap-1 animate-pulse">
              <div className="w-2 h-2 bg-green-700 rounded-full"></div> ONLINE
            </div>
            <div className="flex flex-col-reverse h-full">
              {logs.map((log, idx) => (
                <div key={idx} className={`mb-1 ${idx === 0 ? 'text-green-300 font-bold' : 'text-green-800'}`}>
                  <span className="mr-2 opacity-50">&gt;</span>{log}
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-4 text-green-900 text-xs">
            &copy; 2025 NEXUS_HUB // HOSTED ON VERCEL // REPO: GITHUB
          </div>
        </footer>
      </div>

      {/* MODAL ADD TOOL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-black border border-green-500 w-full max-w-md p-6 relative shadow-[0_0_50px_rgba(34,197,94,0.2)]">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Plus className="text-green-500" /> NEW_MODULE
            </h2>
            <form onSubmit={handleAddTool} className="space-y-4">
              <div>
                <label className="block text-xs text-green-700 mb-1">MODULE_NAME</label>
                <input 
                  autoFocus
                  type="text" 
                  className="w-full bg-green-900/10 border border-green-800 p-2 text-green-400 focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="ex: SQL Injector"
                  value={newTool.name}
                  onChange={(e) => setNewTool({...newTool, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs text-green-700 mb-1">FUNCTION_DESC</label>
                <input 
                  type="text" 
                  className="w-full bg-green-900/10 border border-green-800 p-2 text-green-400 focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="Brief description of capabilities..."
                  value={newTool.desc}
                  onChange={(e) => setNewTool({...newTool, desc: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs text-green-700 mb-1">CATEGORY_TAG</label>
                <select 
                  className="w-full bg-green-900/10 border border-green-800 p-2 text-green-400 focus:border-green-500 focus:outline-none"
                  value={newTool.category}
                  onChange={(e) => setNewTool({...newTool, category: e.target.value})}
                >
                  <option>Network</option>
                  <option>Exploit</option>
                  <option>Crypto</option>
                  <option>Forensics</option>
                  <option>General</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                >
                  ABORT
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-black font-bold hover:bg-green-500 hover:shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all"
                >
                  COMPILE & LOAD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;