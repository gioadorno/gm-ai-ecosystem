import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Shield, Activity, Database, Server, 
  Users, Target, PieChart, Zap, Network, 
  MessageSquare, PenTool, Layout, Download, Play, RefreshCw,
  Search, Cpu, Settings
} from 'lucide-react';

const THEME = {
  bgLight: '#1e253c', // Lighter space background
  bgDark: '#0b0f19',
  it: '#0ea5e9',       // Sky Blue
  account: '#10b981',  // Emerald
  campaign: '#8b5cf6', // Violet
  sales: '#eab308',    // Yellow
  art: '#ec4899',      // Pink
  mcp: '#f97316'       // Orange (Main Control Points)
};

const DEPARTMENTS = [
  { id: 'it', label: 'IT / SYSTEMS', color: THEME.it, angle: -Math.PI / 2 }, // Top
  { id: 'am', label: 'ACCOUNT MANAGERS', color: THEME.account, angle: -Math.PI / 2 + (Math.PI * 2 / 5) * 1 },
  { id: 'cm', label: 'CAMPAIGN MANAGERS', color: THEME.campaign, angle: -Math.PI / 2 + (Math.PI * 2 / 5) * 2 },
  { id: 'sales', label: 'SALES', color: THEME.sales, angle: -Math.PI / 2 + (Math.PI * 2 / 5) * 3 },
  { id: 'art', label: 'ART & CREATIVES', color: THEME.art, angle: -Math.PI / 2 + (Math.PI * 2 / 5) * 4 },
];

const AGENTS = [
  // IT / SYSTEMS
  { id: 'it-mcp', deptId: 'it', parentId: 'it', isMCP: true, label: 'Cloud Controller', icon: Server, details: {
    subtitle: "Automated scaling and Kubernetes cluster management.",
    replaces: "Manual yaml editing and midnight scaling fire-drills.",
    buildNotes: "Wired into AWS EKS via Go microservices. Uses Terraform for Infrastructure as Code.",
    tech: ["Go", "Kubernetes", "Terraform"]
  }},
  { id: 'it-1', deptId: 'it', parentId: 'it-mcp', label: 'Security Bot', icon: Shield, details: {
    subtitle: "Continuous vulnerability scanning.",
    replaces: "Quarterly penetration tests.",
    buildNotes: "Runs local LLMs to detect abnormal traffic patterns via ConnectRPC.",
    tech: ["ConnectRPC", "Python", "Rust"]
  }},
  { id: 'it-2', deptId: 'it', parentId: 'it-mcp', label: 'DB Scaler', icon: Database, details: {
    subtitle: "Autonomous database indexing.",
    replaces: "DBAs hunting slow queries.",
    buildNotes: "Runs EXPLAIN ANALYZE automatically and applies concurrent indices.",
    tech: ["PostgreSQL", "GraphQL", "Prisma"]
  }},
  { id: 'it-3', deptId: 'it', parentId: 'it', label: 'Network Monitor', icon: Network, details: {
    subtitle: "Real-time latency resolution.",
    replaces: "Staring at Datadog dashboards.",
    buildNotes: "High-frequency time-series analysis.",
    tech: ["Grafana", "Go"]
  }},

  // CAMPAIGN MANAGERS
  { id: 'cm-mcp', deptId: 'cm', parentId: 'cm', isMCP: true, label: 'Ad Optimizer', icon: Zap, details: {
    subtitle: "Real-time bidding and budget allocation.",
    replaces: "Manual SDR bid adjustments across platforms.",
    buildNotes: "High-performance Angular 19 frontend connected to a Go gRPC core.",
    tech: ["Angular 19", "Go", "gRPC"]
  }},
  { id: 'cm-1', deptId: 'cm', parentId: 'cm-mcp', label: 'Spend Monitor', icon: PieChart, details: {
    subtitle: "Pacing tracker to prevent overspend.",
    replaces: "Daily pivot table calculations.",
    buildNotes: "Connects to billing API to pause campaigns if ROAS drops.",
    tech: ["ConnectRPC", "Node.js"]
  }},
  { id: 'cm-2', deptId: 'cm', parentId: 'cm', label: 'Anomaly Detector', icon: Target, details: {
    subtitle: "Click-fraud detection.",
    replaces: "Paying for bot traffic on mobile games.",
    buildNotes: "Streams data via Kafka, null-routes bad IPs.",
    tech: ["Rust", "Kafka", "Redis"]
  }},
  { id: 'cm-3', deptId: 'cm', parentId: 'cm', label: 'Audience Builder', icon: Users, details: {
    subtitle: "Lookalike generation.",
    replaces: "Guessing demographics.",
    buildNotes: "Pulls from PostgreSQL datalake.",
    tech: ["GraphQL", "PostgreSQL"]
  }},

  // SALES
  { id: 'sales-mcp', deptId: 'sales', parentId: 'sales', isMCP: true, label: 'Outreach Hub', icon: MessageSquare, details: {
    subtitle: "Multi-step cold email sequences.",
    replaces: "Sending generic templates to thousands.",
    buildNotes: "Analyzes target websites to draft personalized payloads.",
    tech: ["ConnectRPC", "OpenAI", "Go"]
  }},
  { id: 'sales-1', deptId: 'sales', parentId: 'sales-mcp', label: 'Lead Sourcing', icon: Search, details: {
    subtitle: "Layer firmographics and tech stack trends.",
    replaces: "Skipping research.",
    buildNotes: "Built on Exa and Firecrawl.",
    tech: ["GraphQL", "Firecrawl"]
  }},
  { id: 'sales-2', deptId: 'sales', parentId: 'sales', label: 'Deal Scorer', icon: Activity, details: {
    subtitle: "Predictive closing probabilities.",
    replaces: "Happy ears on dead deals.",
    buildNotes: "Analyzes email response times.",
    tech: ["Scikit-Learn", "PostgreSQL"]
  }},
  { id: 'sales-3', deptId: 'sales', parentId: 'sales', label: 'CRM Updater', icon: Database, details: {
    subtitle: "Autonomous call logging.",
    replaces: "Sales reps doing data entry.",
    buildNotes: "Listens to Zoom calls and updates Salesforce.",
    tech: ["Python", "FastAPI"]
  }},

  // ACCOUNT MANAGERS
  { id: 'am-mcp', deptId: 'am', parentId: 'am', isMCP: true, label: 'Client Portal', icon: Layout, details: {
    subtitle: "Automated kickoff and asset collection.",
    replaces: "Endless email chains for logos.",
    buildNotes: "Generates personalized dynamic portals.",
    tech: ["Angular 19", "Node.js"]
  }},
  { id: 'am-1', deptId: 'am', parentId: 'am-mcp', label: 'Retention AI', icon: Activity, details: {
    subtitle: "Churn prediction.",
    replaces: "Being blindsided by non-renewals.",
    buildNotes: "Monitors login frequency telemetry.",
    tech: ["PostgreSQL", "Go"]
  }},
  { id: 'am-2', deptId: 'am', parentId: 'am', label: 'Upsell Finder', icon: Target, details: {
    subtitle: "Flags accounts hitting limits.",
    replaces: "Leaving money on the table.",
    buildNotes: "Queries billing databases.",
    tech: ["ConnectRPC", "Stripe API"]
  }},

  // ART & CREATIVES
  { id: 'art-mcp', deptId: 'art', parentId: 'art', isMCP: true, label: 'Asset Engine', icon: Cpu, details: {
    subtitle: "Bulk generation of ad variations.",
    replaces: "Resizing the same banner 14 times.",
    buildNotes: "Interfaces with Figma REST API.",
    tech: ["Figma API", "Node.js"]
  }},
  { id: 'art-1', deptId: 'art', parentId: 'art-mcp', label: 'Copy Generator', icon: PenTool, details: {
    subtitle: "Headlines and descriptions.",
    replaces: "Staring at a blank screen.",
    buildNotes: "Generates A/B test variations.",
    tech: ["OpenAI", "Go"]
  }},
  { id: 'art-2', deptId: 'art', parentId: 'art', label: 'Video Editor', icon: Play, details: {
    subtitle: "Automated splicing.",
    replaces: "Manual Premiere Pro syncing.",
    buildNotes: "Uses FFmpeg and Whisper AI.",
    tech: ["FFmpeg", "Whisper AI"]
  }},
  { id: 'art-3', deptId: 'art', parentId: 'art', label: 'Brand Checker', icon: Shield, details: {
    subtitle: "Visual QA against guidelines.",
    replaces: "Running ads with old logos.",
    buildNotes: "Uses computer vision.",
    tech: ["OpenCV", "Python"]
  }},
];

function getSpreadAngle(baseAngle, spread, index, total) {
  if (total === 1) return baseAngle;
  const start = baseAngle - spread / 2;
  const step = spread / (total - 1);
  return start + step * index;
}

// Function to create SVG pie slice paths for invisible hover zones
function createPieSlice(cx, cy, r, startAngle, endAngle) {
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
}

const SidePanel = ({ agent, onClose }) => {
  const deptColor = DEPARTMENTS.find(d => d.id === agent.deptId)?.color || '#fff';
  const nodeColor = agent.isMCP ? THEME.mcp : deptColor;

  return (
    <motion.div 
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="side-panel-container absolute top-0 right-0 w-[450px] max-w-full h-full bg-[#111625]/95 backdrop-blur-2xl border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col z-[100]"
      onPointerDown={(e) => e.stopPropagation()} // Stop clicks from panning the map
    >
      <div className="p-8 border-b border-white/5 relative bg-gradient-to-b from-white/5 to-transparent">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/5 rounded-full p-2 transition-colors">
          <X size={18} />
        </button>
        
        <div className="flex items-center gap-4 mb-5">
           <div className="p-4 rounded-xl bg-[#1A2133] border border-white/10 shadow-inner">
             <agent.icon size={32} style={{ color: nodeColor }} />
           </div>
           <div>
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-1.5" style={{ color: nodeColor }}>
                {agent.isMCP ? 'Main Control Point (MCP)' : 'Autonomous Agent'}
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight leading-none">
                {agent.label}
              </h2>
           </div>
        </div>
        
        <p className="text-sm text-white/70 leading-relaxed mb-6">
          {agent.details.subtitle}
        </p>

        <button className="w-full bg-[#202940] hover:bg-[#2A3550] border border-white/10 hover:border-white/20 rounded-lg p-4 flex items-center justify-between transition-all group shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-white/5 p-2 rounded-md text-white/60 group-hover:text-white transition-colors">
              <Download size={18} />
            </div>
            <div className="text-left">
              <span className="text-sm font-semibold text-white block mb-0.5">1 runnable skill file</span>
              <span className="text-[11px] text-white/40 uppercase tracking-wider">Yours to download</span>
            </div>
          </div>
          <span className="text-xs font-bold text-white/40 group-hover:text-white uppercase tracking-widest transition-colors">Take it ↓</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
        <div>
           <h3 className="text-[10px] font-bold text-white/40 tracking-[0.15em] mb-3 uppercase flex items-center gap-2">
             <Settings size={12}/> Wired Into
           </h3>
           <div className="flex flex-wrap gap-2">
              {agent.details.tech.map(t => (
                <span key={t} className="px-3 py-1.5 rounded-md bg-[#1A2133] border border-white/10 text-xs font-medium text-white/80 shadow-sm">
                  {t}
                </span>
              ))}
           </div>
        </div>

        <div>
           <h3 className="text-[10px] font-bold text-white/40 tracking-[0.15em] mb-3 uppercase">What It Replaces</h3>
           <div className="bg-[#1A2133] border border-white/10 rounded-lg p-5 text-sm text-white/80 leading-relaxed shadow-inner">
             {agent.details.replaces}
           </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-white/40 tracking-[0.15em] mb-4 uppercase border-b border-white/5 pb-2">The Ladder</h3>
          <div className="space-y-5">
              <div className="grid grid-cols-[120px_1fr] gap-4 text-sm items-start">
                <div className="font-bold tracking-wider text-white/30 text-xs mt-0.5">HUMAN-LED</div>
                <div className="text-white/40 leading-relaxed text-xs">A human executes this process entirely manually.</div>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4 text-sm items-start">
                <div className="font-bold tracking-wider text-white/60 text-xs mt-0.5">HUMAN-ASSISTED</div>
                <div className="text-white/70 leading-relaxed text-xs">The agent drafts the work; a human reviews and approves.</div>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4 text-sm items-start bg-white/5 p-3 rounded-lg -ml-3 -mr-3 border border-white/5">
                <div className="font-bold tracking-wider text-white text-xs mt-0.5 flex items-center gap-2">
                  <RefreshCw size={12} className="animate-spin-slow" style={{ color: nodeColor }} />
                  AUTONOMOUS
                </div>
                <div className="text-white leading-relaxed text-sm font-medium">
                  Agents execute on a schedule independently.
                </div>
              </div>
          </div>
        </div>

        <div>
           <h3 className="text-[10px] font-bold text-white/40 tracking-[0.15em] mb-3 uppercase">Build Notes</h3>
           <div className="text-sm text-white/60 leading-relaxed p-4 rounded-lg border border-dashed border-white/10 bg-[#1A2133]">
             {agent.details.buildNotes}
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [activeDept, setActiveDept] = useState(null);
  const [activeAgent, setActiveAgent] = useState(null);
  const [hoveredDept, setHoveredDept] = useState(null); 
  
  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 0.4 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, isDragging: false });
  const containerRef = useRef(null);

  // Pan and Zoom Mechanics
  const handlePointerDown = (e) => {
    if (e.button !== 0) return; // Only left click pan
    dragRef.current = { startX: e.clientX - camera.x, startY: e.clientY - camera.y, isDragging: false };
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    dragRef.current.isDragging = true;
    setCamera(prev => ({ ...prev, x: e.clientX - dragRef.current.startX, y: e.clientY - dragRef.current.startY }));
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    setTimeout(() => { dragRef.current.isDragging = false; }, 50);
  };

  const handleWheel = (e) => {
    // If scrolling inside the side panel, do not zoom the map
    if (e.target.closest('.side-panel-container')) return;

    e.preventDefault(); // Prevent page scroll
    setCamera(prev => {
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(0.15, Math.min(prev.scale * zoomFactor, 2.5));
      return { ...prev, scale: newScale };
    });
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) { el.addEventListener('wheel', handleWheel, { passive: false }); }
    return () => { if (el) el.removeEventListener('wheel', handleWheel); };
  }, []);

  // MATHEMATICAL LAYOUT ENGINE
  // This statically computes the exact (X,Y) of every node exactly once.
  const { nodes, edges, sections } = useMemo(() => {
    const layoutNodes = [];
    const layoutEdges = [];
    const layoutSections = [];

    layoutNodes.push({ id: 'core', type: 'core', x: 0, y: 0 });

    const R_DEPT = 350;
    const R_TITLE = 750; // Farther out for section titles to prevent overlap
    const R_AGENT = 200;
    const R_SUB = 120;

    DEPARTMENTS.forEach((dept, deptIndex) => {
      // 1. Calculate section wedges for hover zones
      const sectionAngle = (Math.PI * 2) / DEPARTMENTS.length;
      const startAngle = dept.angle - sectionAngle / 2;
      const endAngle = dept.angle + sectionAngle / 2;
      const pathData = createPieSlice(0, 0, 1500, startAngle, endAngle);
      layoutSections.push({ id: dept.id, path: pathData });

      // 2. Department Hub
      const dx = Math.cos(dept.angle) * R_DEPT;
      const dy = Math.sin(dept.angle) * R_DEPT;
      
      layoutNodes.push({ ...dept, type: 'dept', x: dx, y: dy });
      layoutEdges.push({ id: `core-${dept.id}`, deptId: dept.id, x1: 0, y1: 0, x2: dx, y2: dy, color: dept.color });

      // 3. Department Title (Fixed at outer edge)
      const tx = Math.cos(dept.angle) * R_TITLE;
      const ty = Math.sin(dept.angle) * R_TITLE;
      layoutNodes.push({ id: `title-${dept.id}`, type: 'title', deptId: dept.id, label: dept.label, x: tx, y: ty, color: dept.color });

      // 4. Agents
      const directAgents = AGENTS.filter(a => a.deptId === dept.id && a.parentId === dept.id);
      const agentSpread = Math.PI / 1.5;

      directAgents.forEach((agent, i) => {
        const aAngle = getSpreadAngle(dept.angle, agentSpread, i, directAgents.length);
        const ax = dx + Math.cos(aAngle) * R_AGENT;
        const ay = dy + Math.sin(aAngle) * R_AGENT;

        layoutNodes.push({ ...agent, type: 'agent', x: ax, y: ay, color: dept.color });
        layoutEdges.push({ id: `${dept.id}-${agent.id}`, deptId: dept.id, x1: dx, y1: dy, x2: ax, y2: ay, color: dept.color });

        // 5. Sub Agents
        const subAgents = AGENTS.filter(a => a.parentId === agent.id);
        const subSpread = Math.PI / 2;
        
        subAgents.forEach((sub, j) => {
          const sAngle = getSpreadAngle(aAngle, subSpread, j, subAgents.length);
          const sx = ax + Math.cos(sAngle) * R_SUB;
          const sy = ay + Math.sin(sAngle) * R_SUB;

          layoutNodes.push({ ...sub, type: 'agent', x: sx, y: sy, color: dept.color });
          layoutEdges.push({ id: `${agent.id}-${sub.id}`, deptId: dept.id, x1: ax, y1: ay, x2: sx, y2: sy, color: dept.color });
        });
      });
    });

    return { nodes: layoutNodes, edges: layoutEdges, sections: layoutSections };
  }, []);

  const handleNodeClick = (e, node) => {
    e.stopPropagation();
    if (dragRef.current.isDragging) return;

    if (node.type === 'core') {
      setActiveDept(null);
      setActiveAgent(null);
      setCamera({ x: 0, y: 0, scale: 0.4 });
    } else if (node.type === 'dept' || node.type === 'title') {
      // Zoom into department, open details
      setActiveDept(node.id || node.deptId);
      setActiveAgent(null);
      // Pan to center the department hub, slightly offset left to account for panel
      const targetNode = nodes.find(n => n.id === (node.id || node.deptId));
      setCamera({ x: -targetNode.x, y: -targetNode.y, scale: 0.8 });
    } else if (node.type === 'agent') {
      // Open agent config panel
      setActiveDept(node.deptId);
      setActiveAgent(node);
      // Zoom and pan to the specific agent
      setCamera({ x: -node.x - 200, y: -node.y, scale: 1.1 });
    }
  };

  const handleCanvasClick = () => {
    if (!dragRef.current.isDragging) {
      setActiveDept(null);
      setActiveAgent(null);
      setCamera({ x: 0, y: 0, scale: 0.4 });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden font-sans select-none"
      style={{
        background: `radial-gradient(circle at center, ${THEME.bgLight} 0%, ${THEME.bgDark} 100%)`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={handleCanvasClick}
    >
      {/* Starfield overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-screen" />
      
      {/* The Camera Layer */}
      <motion.div 
        className="absolute top-1/2 left-1/2 origin-center"
        animate={{ x: camera.x, y: camera.y, scale: camera.scale }}
        transition={{ type: 'spring', damping: 30, stiffness: 150 }}
      >
        {/* Invisible Hover Sections (The Pie Slices) */}
        <svg className="absolute overflow-visible z-0" style={{ pointerEvents: 'auto' }}>
          {sections.map(section => (
            <path
              key={`section-${section.id}`}
              d={section.path}
              fill="transparent"
              onMouseEnter={() => setHoveredDept(section.id)}
              onMouseLeave={() => setHoveredDept(null)}
              onClick={(e) => {
                if(!dragRef.current.isDragging) {
                  const deptNode = nodes.find(n => n.id === section.id);
                  handleNodeClick(e, deptNode);
                }
              }}
              className="cursor-pointer"
            />
          ))}
        </svg>

        {/* Connections Layer */}
        <svg className="absolute overflow-visible pointer-events-none z-10">
          {edges.map(edge => {
             const isDeptActive = activeDept === edge.deptId;
             const isDeptHovered = hoveredDept === edge.deptId;
             const isOtherActive = activeDept && !isDeptActive;
             
             let strokeOpacity = 0.25; // Default opacity for the constellation
             if (isDeptActive) strokeOpacity = 0.7;
             else if (isDeptHovered) strokeOpacity = 0.5;
             else if (isOtherActive) strokeOpacity = 0.05;

             return (
              <line
                key={edge.id}
                x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2}
                stroke={edge.color}
                strokeWidth={isDeptActive ? 2 : 1}
                strokeOpacity={strokeOpacity}
                className="transition-all duration-500"
              />
            )
          })}
        </svg>

        {/* Nodes Layer */}
        {nodes.map(node => {
          
          // --- RENDER CORE HUB ---
          if (node.type === 'core') {
            return (
              <div
                key={node.id}
                className="absolute flex items-center justify-center rounded-full bg-[#111625] border-2 border-white/80 z-40 cursor-pointer shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                style={{ transform: 'translate(-50%, -50%)', left: node.x, top: node.y, width: 80, height: 80 }}
                onClick={(e) => handleNodeClick(e, node)}
                onMouseEnter={() => setHoveredDept('core')}
                onMouseLeave={() => setHoveredDept(null)}
              >
                <div className="w-[68px] h-[68px] rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md">
                  <Activity size={28} className="text-white" />
                </div>
              </div>
            );
          }

          // --- RENDER SECTION TITLES ---
          if (node.type === 'title') {
            const isActive = activeDept === node.deptId;
            const isHovered = hoveredDept === node.deptId;
            const isDimmed = activeDept && !isActive;

            return (
              <div
                key={node.id}
                className={`absolute pointer-events-none whitespace-nowrap z-30 transition-all duration-500 ${isDimmed ? 'opacity-10' : (isActive || isHovered ? 'opacity-100 scale-110' : 'opacity-60')}`}
                style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
              >
                <h2 className="text-3xl font-bold tracking-[0.4em] uppercase" style={{ color: node.color, textShadow: `0 0 20px ${node.color}80` }}>
                   {node.label}
                </h2>
              </div>
            );
          }

          // --- RENDER DEPARTMENT HUBS ---
          if (node.type === 'dept') {
            const isActive = activeDept === node.id;
            const isHovered = hoveredDept === node.id;
            const isDimmed = activeDept && !isActive;
            
            return (
              <motion.div
                key={node.id}
                className={`absolute flex items-center justify-center rounded-full bg-[#111625] cursor-pointer z-40 transition-opacity duration-500 pointer-events-auto ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
                style={{ left: node.x, top: node.y }}
                animate={{ 
                  x: "-50%", y: "-50%", // Keep perfectly centered on coords
                  width: isActive ? 72 : 56,
                  height: isActive ? 72 : 56,
                  borderWidth: isActive ? 2 : (isHovered ? 2 : 1),
                  borderColor: node.color,
                  boxShadow: isActive ? `0 0 50px ${node.color}60` : (isHovered ? `0 0 20px ${node.color}40` : 'none')
                }}
                onClick={(e) => handleNodeClick(e, node)}
                onMouseEnter={() => setHoveredDept(node.id)}
                onMouseLeave={() => setHoveredDept(null)}
              >
                 <div className="absolute inset-0 opacity-20 rounded-full" style={{ backgroundColor: node.color }} />
                 <Database size={isActive ? 32 : 24} style={{ color: node.color }} />
              </motion.div>
            );
          }

          // --- RENDER AGENTS & SUB-AGENTS ---
          if (node.type === 'agent') {
            const isActiveDept = activeDept === node.deptId;
            const isHoveredDept = hoveredDept === node.deptId;
            const isSelected = activeAgent?.id === node.id;
            const isDimmed = activeDept && activeDept !== node.deptId;
            
            // Dynamic Size based on state
            let size = 12; // Base dot size for constellation view
            if (isActiveDept) {
               size = node.isMCP ? 56 : 44; // Expand to full size when department is clicked
            } else if (node.isMCP) {
               size = 18; // MCPs are slightly larger dots when zoomed out
            }

            const nodeColor = node.isMCP ? THEME.mcp : node.color;

            return (
              <motion.div
                key={node.id}
                className={`absolute flex items-center justify-center rounded-full bg-[#111625] cursor-pointer transition-opacity duration-500 pointer-events-auto ${isActiveDept ? 'z-50' : 'z-20'} ${isDimmed ? 'opacity-20' : 'opacity-100'}`}
                style={{ left: node.x, top: node.y }}
                animate={{ 
                  x: "-50%", y: "-50%", // Keep perfectly centered on coords
                  width: size, height: size,
                  borderWidth: isActiveDept ? 2 : (node.isMCP ? 2 : 0),
                  borderColor: nodeColor,
                  backgroundColor: isSelected ? nodeColor : (node.isMCP && !isActiveDept ? nodeColor : '#111625'),
                  boxShadow: isSelected ? `0 0 30px ${nodeColor}80` : (node.isMCP && isActiveDept ? `0 0 20px ${nodeColor}50` : 'none')
                }}
                onClick={(e) => handleNodeClick(e, node)}
                onMouseEnter={() => setHoveredDept(node.deptId)}
                onMouseLeave={() => setHoveredDept(null)}
              >
                {/* Expanded Details: Icon */}
                <AnimatePresence mode="wait">
                  {isActiveDept && (
                    <motion.div
                      key="icon" 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <node.icon size={node.isMCP ? 24 : 20} style={{ color: isSelected ? '#111625' : nodeColor }} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expanded Details: Label */}
                <AnimatePresence mode="wait">
                  {isActiveDept && (
                    <motion.div
                      key="label"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: node.isMCP ? 45 : 36 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute whitespace-nowrap text-[11px] font-bold tracking-widest px-3 py-1.5 rounded-md bg-[#1A2133]/95 backdrop-blur-sm border border-white/10 text-white shadow-xl pointer-events-none"
                    >
                      {node.label}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Fallback Dot color when NOT active */}
                {!isActiveDept && !node.isMCP && (
                   <div className="w-full h-full rounded-full" style={{ backgroundColor: nodeColor }} />
                )}
              </motion.div>
            );
          }

          return null;
        })}
      </motion.div>

      {/* Configuration Side Panel */}
      <AnimatePresence>
        {activeAgent && <SidePanel agent={activeAgent} onClose={() => setActiveAgent(null)} />}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-spin-slow { animation: spin 4s linear infinite; }
      `}} />
    </div>
  );
}