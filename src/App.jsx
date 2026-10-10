import React, { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Shield,
  Activity,
  Database,
  Server,
  Users,
  Target,
  PieChart,
  Zap,
  Network,
  MessageSquare,
  PenTool,
  Layout,
  Download,
  Play,
  RefreshCw,
  Search,
  Cpu,
  Settings,
  ChevronDown,
  Check,
  Plus,
  Clock,
  FileText,
  CheckCircle2,
  XCircle,
  BrainCircuit,
} from "lucide-react";

const THEME = {
  bgLight: "#1e253c",
  bgDark: "#0b0f19",
  it: "#0ea5e9",
  account: "#10b981",
  campaign: "#8b5cf6",
  sales: "#eab308",
  art: "#ec4899",
  mcp: "#f97316",
};

const INITIAL_DEPARTMENTS = [
  { id: "it", label: "IT / SYSTEMS", color: THEME.it, angle: -Math.PI / 2 },
  {
    id: "am",
    label: "ACCOUNT MANAGERS",
    color: THEME.account,
    angle: -Math.PI / 2 + ((Math.PI * 2) / 5) * 1,
  },
  {
    id: "cm",
    label: "CAMPAIGN MANAGERS",
    color: THEME.campaign,
    angle: -Math.PI / 2 + ((Math.PI * 2) / 5) * 2,
  },
  {
    id: "sales",
    label: "SALES",
    color: THEME.sales,
    angle: -Math.PI / 2 + ((Math.PI * 2) / 5) * 3,
  },
  {
    id: "art",
    label: "ART & CREATIVES",
    color: THEME.art,
    angle: -Math.PI / 2 + ((Math.PI * 2) / 5) * 4,
  },
];

const INITIAL_AGENTS = [
  // IT / SYSTEMS
  {
    id: "it-mcp",
    deptId: "it",
    parentId: "it",
    type: "mcp",
    label: "Cloud Controller",
    icon: Server,
    status: "active",
    details: {
      model: "3.1 Pro",
      reasoning: "High",
      rules: "Standard Infrastructure v3",
      boundary: "AWS EKS Cluster",
    },
  },
  {
    id: "it-1",
    deptId: "it",
    parentId: "it-mcp",
    type: "agent",
    label: "Security Bot",
    icon: Shield,
    status: "active",
    details: {
      model: "3.8 Flash",
      reasoning: "Medium",
      rules: "Zero Trust Override",
      boundary: "VPC Logs",
    },
  },
  {
    id: "it-2",
    deptId: "it",
    parentId: "it-mcp",
    type: "agent",
    label: "DB Scaler",
    icon: Database,
    status: "active",
    details: {
      model: "3.5 Flash-Lite",
      reasoning: "Low",
      rules: "Cost-capped Scaling",
      boundary: "PostgreSQL DB",
    },
  },
  {
    id: "it-3",
    deptId: "it",
    parentId: "it",
    type: "agent",
    label: "Network Monitor",
    icon: Network,
    status: "active",
    details: {
      model: "3.5 Flash-Lite",
      reasoning: "Low",
      rules: "P99 Latency Alerts",
      boundary: "Grafana Stream",
    },
  },

  // CAMPAIGN MANAGERS
  {
    id: "cm-mcp",
    deptId: "cm",
    parentId: "cm",
    type: "mcp",
    label: "Ad Optimizer",
    icon: Zap,
    status: "active",
    details: {
      model: "3.1 Pro",
      reasoning: "High",
      rules: "ROAS Maximizer",
      boundary: "Ad Platform APIs",
    },
  },
  {
    id: "cm-1",
    deptId: "cm",
    parentId: "cm-mcp",
    type: "agent",
    label: "Spend Monitor",
    icon: PieChart,
    status: "active",
    details: {
      model: "3.8 Flash",
      reasoning: "Medium",
      rules: "Strict Pacing Guard",
      boundary: "Billing DB",
    },
  },
  {
    id: "cm-2",
    deptId: "cm",
    parentId: "cm",
    type: "agent",
    label: "Anomaly Detector",
    icon: Target,
    status: "active",
    details: {
      model: "3.5 Flash-Lite",
      reasoning: "Low",
      rules: "Bot Traffic Filter",
      boundary: "Clickstream Data",
    },
  },

  // SALES
  {
    id: "sales-mcp",
    deptId: "sales",
    parentId: "sales",
    type: "mcp",
    label: "Outreach Hub",
    icon: MessageSquare,
    status: "active",
    details: {
      model: "3.1 Pro",
      reasoning: "Medium",
      rules: "Warm Intro Protocol",
      boundary: "CRM + Email",
    },
  },
  {
    id: "sales-1",
    deptId: "sales",
    parentId: "sales-mcp",
    type: "agent",
    label: "Lead Sourcing",
    icon: Search,
    status: "active",
    details: {
      model: "3.8 Flash",
      reasoning: "Medium",
      rules: "ICP Match Scoring",
      boundary: "Firecrawl Exa",
    },
  },
  {
    id: "sales-2",
    deptId: "sales",
    parentId: "sales",
    type: "agent",
    label: "Deal Scorer",
    icon: Activity,
    status: "active",
    details: {
      model: "3.5 Flash-Lite",
      reasoning: "Low",
      rules: "Pipeline Velocity",
      boundary: "Salesforce DB",
    },
  },

  // ACCOUNT MANAGERS
  {
    id: "am-app",
    deptId: "am",
    parentId: "am",
    type: "app",
    label: "Caveat",
    icon: Layout,
    status: "active",
    details: {
      model: "3.1 Pro",
      reasoning: "High",
      rules: "Client Portal Rules",
      boundary: "Caveat Auth DB",
    },
  },
  {
    id: "am-1",
    deptId: "am",
    parentId: "am-app",
    type: "agent",
    label: "Retention AI",
    icon: Activity,
    status: "active",
    details: {
      model: "3.8 Flash",
      reasoning: "Medium",
      rules: "Churn Prevention",
      boundary: "Telemetry Logs",
    },
  },
  {
    id: "am-2",
    deptId: "am",
    parentId: "am-app",
    type: "agent",
    label: "Upsell Finder",
    icon: Target,
    status: "active",
    details: {
      model: "3.5 Flash-Lite",
      reasoning: "Low",
      rules: "Limit Breaker Prompts",
      boundary: "Stripe API",
    },
  },

  // ART & CREATIVES (Massively expanded)
  {
    id: "art-mcp",
    deptId: "art",
    parentId: "art",
    type: "mcp",
    label: "Asset Engine",
    icon: Cpu,
    status: "active",
    details: {
      model: "3.1 Pro",
      reasoning: "High",
      rules: "Brand Guidelines v4",
      boundary: "Figma API",
    },
  },
  {
    id: "art-app",
    deptId: "art",
    parentId: "art-mcp",
    type: "app",
    label: "Studio Hub",
    icon: Layout,
    status: "active",
    details: {
      model: "3.8 Flash",
      reasoning: "Medium",
      rules: "Creative Sync Protocol",
      boundary: "Asset DB",
    },
  },
  {
    id: "art-copy",
    deptId: "art",
    parentId: "art-mcp",
    type: "agent",
    label: "Copy Generator",
    icon: PenTool,
    status: "active",
    details: {
      model: "3.1 Pro",
      reasoning: "High",
      rules: "Tone of Voice Guide",
      boundary: "Copy Vault",
    },
  },
  {
    id: "art-color",
    deptId: "art",
    parentId: "art-app",
    type: "agent",
    label: "Color Matcher",
    icon: Target,
    status: "active",
    details: {
      model: "3.5 Flash-Lite",
      reasoning: "Low",
      rules: "Hex Exact Match",
      boundary: "Studio Palette",
    },
  },
  {
    id: "art-render",
    deptId: "art",
    parentId: "art-app",
    type: "mcp",
    label: "Render Controller",
    icon: Play,
    status: "active",
    details: {
      model: "3.8 Flash",
      reasoning: "Medium",
      rules: "Queue Management",
      boundary: "GPU Cluster",
    },
  },
  {
    id: "art-3d",
    deptId: "art",
    parentId: "art-render",
    type: "agent",
    label: "3D Modeler",
    icon: Database,
    status: "active",
    details: {
      model: "3.1 Pro",
      reasoning: "High",
      rules: "Topology Limits",
      boundary: "Blender API",
    },
  },
  {
    id: "art-texture",
    deptId: "art",
    parentId: "art-render",
    type: "agent",
    label: "Texture AI",
    icon: Layout,
    status: "active",
    details: {
      model: "3.8 Flash",
      reasoning: "Medium",
      rules: "PBR Generation",
      boundary: "Texture DB",
    },
  },
];

const CustomDropdown = ({ label, value, options, onChange, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className="flex items-center justify-between p-4 bg-[#111625] border border-white/10 rounded-xl cursor-pointer hover:border-white/20 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={16} className="text-white/40" />}
          <span className="text-sm font-medium text-white/50">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">
            {options.find((o) => o.value === value)?.label || value}
          </span>
          <ChevronDown
            size={14}
            className={`text-white/50 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#1A2133] border border-white/10 rounded-xl shadow-2xl z-[200] overflow-hidden"
          >
            {options.map((opt) => (
              <div
                key={opt.value}
                className="flex items-center justify-between p-4 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                <div>
                  <div className="text-sm font-bold text-white mb-0.5">
                    {opt.label}
                  </div>
                  <div className="text-xs text-white/40">{opt.description}</div>
                </div>
                {value === opt.value && (
                  <Check size={16} className="text-white" />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidePanel = ({ node, nodesArray, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [timeframe, setTimeframe] = useState("24h");

  // Distinguish if we are looking at the core brain or a regular agent node
  const isCore = node.type === "core";

  // Safe color derivation based on node type
  let deptColor = "#fff";
  let nodeColor = "#fff";

  if (!isCore) {
    deptColor =
      INITIAL_DEPARTMENTS.find((d) => d.id === node.deptId)?.color || "#fff";
    nodeColor =
      node.type === "mcp"
        ? THEME.mcp
        : node.type === "app"
          ? "#fff"
          : deptColor;
  }

  const isTargetDisabled = node.status === "disabled";

  const downstreamAgents = isCore
    ? []
    : nodesArray.filter((a) => a.parentId === node.id);
  const totalAgents = nodesArray.filter(
    (a) => a.type === "agent" || a.type === "mcp",
  ).length;
  const totalApps = nodesArray.filter((a) => a.type === "app").length;

  const models = [
    {
      value: "3.5 Flash-Lite",
      label: "3.5 Flash-Lite",
      description: "Fastest answers",
    },
    { value: "3.8 Flash", label: "3.8 Flash", description: "All-around help" },
    { value: "3.1 Pro", label: "3.1 Pro", description: "Advanced reasoning" },
  ];

  const reasonings = [
    { value: "Low", label: "Low", description: "Quick and efficient" },
    { value: "Medium", label: "Medium", description: "Balanced depth" },
    { value: "High", label: "High", description: "Extra thorough" },
  ];

  const handleDisableToggle = () => {
    if (isCore) return;
    const newStatus = isTargetDisabled ? "active" : "disabled";
    const updatedNodes = [...nodesArray];

    const updateRecursively = (targetId, status) => {
      const idx = updatedNodes.findIndex((a) => a.id === targetId);
      if (idx > -1) {
        updatedNodes[idx] = { ...updatedNodes[idx], status };
        const children = updatedNodes.filter((a) => a.parentId === targetId);
        children.forEach((child) => updateRecursively(child.id, status));
      }
    };

    updateRecursively(node.id, newStatus);
    onUpdate(updatedNodes);
  };

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="side-panel-container absolute top-0 right-0 w-[500px] max-w-full h-full bg-[#111625]/95 backdrop-blur-2xl border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col z-[150]"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-8 border-b border-white/5 relative bg-gradient-to-b from-white/5 to-transparent flex-shrink-0">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/5 rounded-full p-2 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div
            className={`p-4 rounded-xl border border-white/10 shadow-inner ${isCore ? "bg-orange-500/20" : node.type === "app" ? "bg-white/10" : "bg-[#1A2133]"}`}
          >
            {isCore ? (
              <BrainCircuit size={32} className="text-orange-400" />
            ) : (
              <node.icon
                size={32}
                style={{ color: isTargetDisabled ? "#666" : nodeColor }}
              />
            )}
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-1.5 flex items-center gap-2">
              {isCore
                ? "Core Brain"
                : node.type === "mcp"
                  ? "Main Control Point"
                  : node.type === "app"
                    ? "Application"
                    : "Autonomous Agent"}
              {!isCore && isTargetDisabled && (
                <span className="px-2 py-0.5 rounded-sm bg-red-500/20 text-red-400 text-[9px]">
                  DISABLED
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight leading-none">
              {node.label}
            </h2>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-6 border-b border-white/10">
          {["Overview", "Defaults", "Rules", "Usage"].map((tab) => {
            if (isCore && (tab === "Defaults" || tab === "Rules")) return null; // Core doesn't have these settings
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === tab ? "text-white" : "text-white/40 hover:text-white/70"}`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 no-scrollbar pb-32">
        {activeTab === "Overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1A2133] border border-white/5 p-4 rounded-xl">
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Clock size={12} /> Uptime
                </div>
                <div className="text-2xl font-bold text-white">
                  {isTargetDisabled ? "0.00%" : "99.98%"}
                </div>
                <div className="text-xs text-green-400 mt-1">Operational</div>
              </div>
              <div className="bg-[#1A2133] border border-white/5 p-4 rounded-xl">
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Activity size={12} /> Calls (24h)
                </div>
                <div className="text-2xl font-bold text-white">
                  {isTargetDisabled ? "0" : isCore ? "1,420,381" : "14,203"}
                </div>
                <div className="text-xs text-white/40 mt-1">
                  {isCore ? "38ms" : "218ms"} avg latency
                </div>
              </div>
            </div>

            {isCore ? (
              <div>
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
                  Ecosystem Stats
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-4 bg-[#1A2133] border border-white/5 rounded-xl">
                    <span className="text-sm text-white/70 font-bold">
                      Total Departments
                    </span>
                    <span className="text-sm text-white font-bold">
                      {INITIAL_DEPARTMENTS.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-[#1A2133] border border-white/5 rounded-xl">
                    <span className="text-sm text-white/70 font-bold">
                      Active Agents
                    </span>
                    <span className="text-sm text-white font-bold">
                      {totalAgents}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-[#1A2133] border border-white/5 rounded-xl">
                    <span className="text-sm text-white/70 font-bold">
                      Monitored Apps
                    </span>
                    <span className="text-sm text-white font-bold">
                      {totalApps}
                    </span>
                  </div>
                </div>
              </div>
            ) : node.type !== "agent" ? (
              <div>
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
                  Downstream Implementations ({downstreamAgents.length})
                </h3>
                <div className="space-y-2">
                  {downstreamAgents.length === 0 && (
                    <div className="text-sm text-white/30 italic">
                      No downstream nodes found.
                    </div>
                  )}
                  {downstreamAgents.map((child) => (
                    <div
                      key={child.id}
                      className="flex items-center justify-between p-4 bg-[#1A2133] border border-white/5 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <child.icon size={16} className="text-white/40" />
                        <div>
                          <div className="text-sm font-bold text-white">
                            {child.label}
                          </div>
                          <div className="text-[10px] text-white/40 uppercase">
                            Inherits defaults
                          </div>
                        </div>
                      </div>
                      <ChevronDown
                        size={14}
                        className="text-white/20 -rotate-90"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {!isCore && activeTab === "Defaults" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
              System Defaults
            </h3>
            <CustomDropdown
              label="Model"
              icon={Cpu}
              value={node.details.model}
              options={models}
              onChange={(val) => {
                const updated = nodesArray.map((a) =>
                  a.id === node.id
                    ? { ...a, details: { ...a.details, model: val } }
                    : a,
                );
                onUpdate(updated);
              }}
            />
            <CustomDropdown
              label="Reasoning"
              icon={Settings}
              value={node.details.reasoning}
              options={reasonings}
              onChange={(val) => {
                const updated = nodesArray.map((a) =>
                  a.id === node.id
                    ? { ...a, details: { ...a.details, reasoning: val } }
                    : a,
                );
                onUpdate(updated);
              }}
            />
            <div className="flex items-center justify-between p-4 bg-[#111625] border border-white/10 rounded-xl mt-4">
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-white/40" />
                <span className="text-sm font-medium text-white/50">
                  Context Boundary
                </span>
              </div>
              <span className="text-sm font-bold text-white">
                {node.details.boundary}
              </span>
            </div>
          </div>
        )}

        {!isCore && activeTab === "Rules" && (
          <div className="space-y-4">
            <div className="bg-[#1A2133] border border-white/10 p-5 rounded-xl text-sm text-white/80 leading-relaxed font-mono">
              {node.details.rules}
            </div>
            <p className="text-xs text-white/40">
              These rules are inherited by all downstream agents unless
              explicitly overridden.
            </p>
          </div>
        )}

        {activeTab === "Usage" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">
                Recent Activity
              </h3>
              <div className="flex bg-[#1A2133] border border-white/5 rounded-md p-0.5">
                {["24h", "7d", "30d", "All"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className={`px-2 py-1 text-[10px] font-bold rounded ${timeframe === t ? "bg-white/10 text-white" : "text-white/40"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#1A2133] border border-white/5 p-4 rounded-xl flex gap-4"
              >
                <div className="mt-1">
                  {i === 3 ? (
                    <XCircle size={16} className="text-red-400" />
                  ) : (
                    <CheckCircle2 size={16} className="text-green-400" />
                  )}
                </div>
                <div className="w-full">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-white font-bold">
                      POST /v1/execute
                    </span>
                    <span className="text-white/30">{i * 12} mins ago</span>
                  </div>
                  <div className="bg-black/30 p-2 rounded text-[10px] font-mono text-white/50 break-all">
                    {`{"query": "${isCore ? "system_heartbeat" : `execute_task_${i}`}", "tokens": ${120 * i}, "status": ${i === 3 ? "500" : "200"}}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      {!isCore && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0b0f19] via-[#111625] to-transparent pointer-events-none">
          <div className="pointer-events-auto flex gap-4">
            <button className="flex-1 py-4 bg-[#1A2133] hover:bg-[#202940] border border-white/10 rounded-xl text-sm font-bold text-white transition-colors shadow-lg">
              View Audit
            </button>
            <button
              onClick={handleDisableToggle}
              className={`flex-1 py-4 border rounded-xl text-sm font-bold transition-colors shadow-lg ${
                isTargetDisabled
                  ? "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                  : "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
              }`}
            >
              {isTargetDisabled ? "Enable System" : "Disable System"}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const CreateNodeModal = ({ nodesArray, drawState, onSave, onCancel }) => {
  const isDepartmentSpawn = drawState.startNode.type === "core";

  // Default to department if coming from core, otherwise agent
  const [type, setType] = useState(isDepartmentSpawn ? "dept" : "agent");
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState("");

  // Find which department this lives in for visual context
  const parentDeptId = isDepartmentSpawn
    ? null
    : drawState.startNode.deptId || drawState.startNode.id;
  const parentDept = INITIAL_DEPARTMENTS.find((d) => d.id === parentDeptId);

  const handleSave = () => {
    if (!name.trim()) return;

    // If it's a completely new department
    if (isDepartmentSpawn && type === "dept") {
      const newDept = {
        id: `dept-${Date.now()}`,
        label: name,
        color: "#3b82f6", // Default blue for new depts
        angle: 0, // Math engine will recalculate this dynamically
      };
      onSave({ isNewDepartment: true, department: newDept });
      return;
    }

    let defaultDetails = {
      model: "3.5 Flash-Lite",
      reasoning: "Medium",
      rules: "Standard rules",
      boundary: "Default Data",
    };

    if (templateId) {
      const templateNode = nodesArray.find((a) => a.id === templateId);
      if (templateNode) defaultDetails = { ...templateNode.details };
    }

    const newNode = {
      id: `node-${Date.now()}`,
      deptId: parentDeptId,
      parentId: drawState.startNode.id,
      type: type,
      label: name,
      icon: type === "app" ? Layout : Database,
      status: "disabled", // Automatically starts disabled
      details: defaultDetails,
    };
    onSave({ isNewDepartment: false, node: newNode });
  };

  return (
    <div
      className="modal-container fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()} // Stop modal scroll from zooming map
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#111625] border border-white/20 w-[450px] rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Plus className="text-green-400" /> Spawn New{" "}
            {isDepartmentSpawn ? "System" : "Node"}
          </h2>
          <p className="text-sm text-white/50 mt-1">
            Deploying into{" "}
            {isDepartmentSpawn
              ? "Core Ecosystem"
              : parentDept?.label || "Ecosystem"}
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">
              Node Type
            </label>
            <div className="flex gap-2 p-1 bg-[#1A2133] rounded-lg border border-white/5">
              {isDepartmentSpawn ? (
                <button className="flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors bg-white/10 text-white shadow-sm">
                  Department
                </button>
              ) : (
                ["agent", "mcp", "app"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${type === t ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/70"}`}
                  >
                    {t}
                  </button>
                ))
              )}
            </div>
          </div>

          {!isDepartmentSpawn && (
            <div>
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">
                Configuration Template
              </label>
              <select
                className="w-full bg-[#1A2133] border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-white/30"
                value={templateId}
                onChange={(e) => {
                  setTemplateId(e.target.value);
                  if (e.target.value) {
                    const t = nodesArray.find((a) => a.id === e.target.value);
                    if (t) setType(t.type);
                  }
                }}
              >
                <option value="">Start from scratch...</option>
                {nodesArray.map((a) => (
                  <option key={a.id} value={a.id}>
                    Clone {a.label} ({a.type})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">
              Identifier (Name)
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                isDepartmentSpawn
                  ? "e.g. Legal & Compliance"
                  : "e.g. Invoicing Agent"
              }
              className="w-full bg-[#1A2133] border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 outline-none focus:border-white/50 transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
            />
          </div>
        </div>

        <div className="p-6 bg-white/5 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl font-bold text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 py-3 bg-white text-black rounded-xl font-bold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Initialize
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [agents, setAgents] = useState(INITIAL_AGENTS);

  const [activeDept, setActiveDept] = useState(null);
  const [activeAgent, setActiveAgent] = useState(null);
  const [hoveredDept, setHoveredDept] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 0.4 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, isDragging: false });
  const containerRef = useRef(null);

  const [drawState, setDrawState] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(null);

  // Pan, Zoom, and Draw Mechanics
  const handlePointerDown = (e) => {
    if (e.button !== 0) return;

    // If clicking on the Draw Handle (+)
    if (e.target.closest(".draw-handle")) {
      e.stopPropagation();
      const rect = e.target.closest(".draw-handle").getBoundingClientRect();
      const svgX =
        (e.clientX - window.innerWidth / 2 - camera.x) / camera.scale;
      const svgY =
        (e.clientY - window.innerHeight / 2 - camera.y) / camera.scale;

      setDrawState({
        startNode: hoveredNode, // hoveredNode contains either the core, a dept, or an agent
        startX: svgX,
        startY: svgY,
        currentX: svgX,
        currentY: svgY,
      });
      return;
    }

    dragRef.current = {
      startX: e.clientX - camera.x,
      startY: e.clientY - camera.y,
      isDragging: false,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (drawState) {
      const svgX =
        (e.clientX - window.innerWidth / 2 - camera.x) / camera.scale;
      const svgY =
        (e.clientY - window.innerHeight / 2 - camera.y) / camera.scale;
      setDrawState((prev) => ({ ...prev, currentX: svgX, currentY: svgY }));
      return;
    }

    if (!isDragging) return;
    dragRef.current.isDragging = true;
    setCamera((prev) => ({
      ...prev,
      x: e.clientX - dragRef.current.startX,
      y: e.clientY - dragRef.current.startY,
    }));
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    setTimeout(() => {
      dragRef.current.isDragging = false;
    }, 50);

    if (drawState) {
      const dx = drawState.currentX - drawState.startX;
      const dy = drawState.currentY - drawState.startY;
      if (Math.sqrt(dx * dx + dy * dy) > 50) {
        setShowCreateModal(drawState);
      }
      setDrawState(null);
    }
  };

  const handleWheel = (e) => {
    // Only block zoom if hovering inside specific panels
    if (
      e.target.closest(".side-panel-container") ||
      e.target.closest(".modal-container")
    )
      return;

    e.preventDefault();
    setCamera((prev) => {
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(0.15, Math.min(prev.scale * zoomFactor, 2.5));
      return { ...prev, scale: newScale };
    });
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (el) el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const { nodes, edges, sections } = useMemo(() => {
    const layoutNodes = [];
    const layoutEdges = [];
    const layoutSections = [];

    // Core Brain Hub
    layoutNodes.push({
      id: "core",
      type: "core",
      x: 0,
      y: 0,
      label: "Core System",
    });

    // Base radius pushes the departments far out
    const BASE_DEPT_RADIUS = 350;

    // Calculate equal angles for all departments dynamically
    const sliceAngle = (Math.PI * 2) / departments.length;

    departments.forEach((dept, idx) => {
      // Reassign angles in case a new department was added
      const dynamicAngle = -Math.PI / 2 + sliceAngle * idx;
      dept.angle = dynamicAngle;

      const startAngle = dynamicAngle - sliceAngle / 2;
      const endAngle = dynamicAngle + sliceAngle / 2;

      // Invisible hover wedges
      const pathData = `M 0 0 L ${2000 * Math.cos(startAngle)} ${2000 * Math.sin(startAngle)} A 2000 2000 0 0 1 ${2000 * Math.cos(endAngle)} ${2000 * Math.sin(endAngle)} Z`;
      layoutSections.push({ id: dept.id, path: pathData });

      // Department Hub
      const dx = Math.cos(dynamicAngle) * BASE_DEPT_RADIUS;
      const dy = Math.sin(dynamicAngle) * BASE_DEPT_RADIUS;
      layoutNodes.push({ ...dept, type: "dept", x: dx, y: dy });
      layoutEdges.push({
        id: `core-${dept.id}`,
        deptId: dept.id,
        x1: 0,
        y1: 0,
        x2: dx,
        y2: dy,
        color: dept.color,
      });

      let maxSimulationRadius = BASE_DEPT_RADIUS;

      // Recursive tree builder using Strict Angular Subdivision
      // 100% guarantees nodes never overlap because they are locked within sub-fractions of an angle
      const buildTree = (parentId, px, py, pAngle, level, sectionWidth) => {
        const children = agents.filter((a) => a.parentId === parentId);
        if (children.length === 0) return;

        // Gap increases slightly on deeper layers to give them room to fan out
        const LAYER_GAP = 200 + level * 20;
        const currentRadius = BASE_DEPT_RADIUS + LAYER_GAP * level;
        if (currentRadius > maxSimulationRadius)
          maxSimulationRadius = currentRadius;

        const slotWidth = sectionWidth / children.length;
        const sAngle = pAngle - sectionWidth / 2 + slotWidth / 2;

        children.forEach((child, i) => {
          const childAngle = sAngle + slotWidth * i;
          const cx = Math.cos(childAngle) * currentRadius;
          const cy = Math.sin(childAngle) * currentRadius;

          layoutNodes.push({ ...child, x: cx, y: cy, color: dept.color });
          layoutEdges.push({
            id: `${parentId}-${child.id}`,
            deptId: dept.id,
            x1: px,
            y1: py,
            x2: cx,
            y2: cy,
            color: dept.color,
            status: child.status,
          });

          // Recursively build deeper, giving children 85% of their parent's angular slot to prevent touching neighbors
          buildTree(child.id, cx, cy, childAngle, level + 1, slotWidth * 0.85);
        });
      };

      // Start the tree recursion giving it 90% of the total department pie slice
      buildTree(dept.id, dx, dy, dynamicAngle, 1, sliceAngle * 0.9);

      // Place Title safely outside the absolute furthest node in the branch
      const R_TITLE = maxSimulationRadius + 200;
      const tx = Math.cos(dynamicAngle) * R_TITLE;
      const ty = Math.sin(dynamicAngle) * R_TITLE;
      layoutNodes.push({
        id: `title-${dept.id}`,
        type: "title",
        deptId: dept.id,
        label: dept.label,
        x: tx,
        y: ty,
        color: dept.color,
      });
    });

    return { nodes: layoutNodes, edges: layoutEdges, sections: layoutSections };
  }, [agents, departments]);

  const handleNodeClick = (e, node) => {
    e.stopPropagation();
    if (dragRef.current.isDragging) return;

    if (node.type === "core") {
      setActiveDept(null);
      setActiveAgent(node);
      setCamera({ x: 0, y: 0, scale: 0.8 }); // Zoom slightly into core brain
    } else if (node.type === "dept" || node.type === "title") {
      const targetDeptId = node.id || node.deptId;
      if (activeDept === targetDeptId) {
        setActiveDept(null);
        setActiveAgent(null);
        setCamera({ x: 0, y: 0, scale: 0.4 });
      } else {
        setActiveDept(targetDeptId);
        setActiveAgent(null);
        const targetNode = nodes.find((n) => n.id === targetDeptId);
        setCamera({ x: -targetNode.x, y: -targetNode.y, scale: 0.8 });
      }
    } else if (
      node.type === "agent" ||
      node.type === "mcp" ||
      node.type === "app"
    ) {
      setActiveDept(node.deptId);
      setActiveAgent(node);
      setCamera({ x: -node.x - 150, y: -node.y, scale: 1.2 });
    }
  };

  const handleCanvasClick = () => {
    if (!dragRef.current.isDragging && !drawState) {
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
        cursor: isDragging ? "grabbing" : drawState ? "crosshair" : "grab",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={handleCanvasClick}
    >
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-screen" />

      {/* Header telemetry */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start pointer-events-none z-[100]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
            <Activity className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-white font-bold tracking-widest uppercase text-xl">
              Genius Monkey
            </h1>
            <div className="text-white/50 text-[10px] tracking-[0.2em] uppercase">
              AI Ecosystem
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-green-400 font-bold tracking-widest text-sm mb-1">
            {agents.length} Nodes Active
          </div>
          <div className="text-white/40 text-[10px] tracking-[0.1em] uppercase">
            {departments.length} Departments •{" "}
            {agents.filter((a) => a.type === "mcp").length} MCPs
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeDept && (
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              setActiveDept(null);
              setActiveAgent(null);
              setCamera({ x: 0, y: 0, scale: 0.4 });
            }}
            className="absolute bottom-8 left-8 z-[100] px-6 py-3 bg-[#111625]/80 hover:bg-[#1A2133] backdrop-blur-md border border-white/20 rounded-full text-white/80 hover:text-white text-xs font-bold tracking-widest uppercase transition-all cursor-pointer shadow-lg"
          >
            ← Reset View
          </motion.button>
        )}
      </AnimatePresence>

      {/* Camera Layer */}
      <motion.div
        className="absolute top-1/2 left-1/2 origin-center"
        animate={{ x: camera.x, y: camera.y, scale: camera.scale }}
        transition={{ type: "spring", damping: 30, stiffness: 150 }}
      >
        {/* Invisible Hover Pie Slices */}
        <svg
          className="absolute overflow-visible z-0"
          style={{ pointerEvents: "auto" }}
        >
          {sections.map((section) => (
            <path
              key={`section-${section.id}`}
              d={section.path}
              fill="transparent"
              onMouseEnter={() => setHoveredDept(section.id)}
              onMouseLeave={() => setHoveredDept(null)}
              onClick={(e) => {
                if (!dragRef.current.isDragging) {
                  const deptNode = nodes.find((n) => n.id === section.id);
                  handleNodeClick(e, deptNode);
                }
              }}
              className="cursor-pointer"
            />
          ))}
        </svg>

        {/* Dynamic Drawing Line */}
        {drawState && (
          <svg className="absolute overflow-visible pointer-events-none z-[100]">
            <line
              x1={drawState.startX}
              y1={drawState.startY}
              x2={drawState.currentX}
              y2={drawState.currentY}
              stroke="#fff"
              strokeWidth={3}
              strokeDasharray="5,5"
              className="animate-pulse"
            />
          </svg>
        )}

        {/* Connection Lines */}
        <svg className="absolute overflow-visible pointer-events-none z-10">
          {edges.map((edge) => {
            const isDeptActive = activeDept === edge.deptId;
            const isDeptHovered = hoveredDept === edge.deptId;
            const isOtherActiveOrHovered =
              (activeDept || hoveredDept) && !(isDeptActive || isDeptHovered);
            const isDisabled = edge.status === "disabled";

            let edgeColor = isDisabled ? "#333" : "rgba(255,255,255,0.25)";
            let strokeWidth = 1;
            let strokeOpacity = 1;

            if (isDeptActive || isDeptHovered) {
              edgeColor = isDisabled ? "#444" : edge.color;
              strokeWidth = isDeptActive ? 3 : 2;
              strokeOpacity = isDeptActive ? 0.9 : 0.6;
            } else if (isOtherActiveOrHovered) {
              strokeOpacity = 0.5; // Changed from 0.4 to 0.5 to keep ecosystem visible
            }

            return (
              <line
                key={edge.id}
                x1={edge.x1}
                y1={edge.y1}
                x2={edge.x2}
                y2={edge.y2}
                stroke={edgeColor}
                strokeWidth={strokeWidth}
                strokeOpacity={strokeOpacity}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          if (node.type === "core") {
            const isSelected = activeAgent?.id === "core";
            const isHovered = hoveredNode?.id === "core";

            return (
              <div
                key={node.id}
                className="absolute flex items-center justify-center rounded-full bg-[#111625] border-2 border-orange-500/50 z-40 cursor-pointer shadow-[0_0_50px_rgba(249,115,22,0.15)]"
                style={{
                  transform: "translate(-50%, -50%)",
                  left: node.x,
                  top: node.y,
                  width: 90,
                  height: 90,
                }}
                onClick={(e) => handleNodeClick(e, node)}
                onMouseEnter={() => {
                  setHoveredDept("core");
                  setHoveredNode(node);
                }}
                onMouseLeave={() => {
                  setHoveredDept(null);
                  setHoveredNode(null);
                }}
              >
                <div
                  className={`w-[78px] h-[78px] rounded-full border border-orange-500/30 flex items-center justify-center bg-orange-500/10 backdrop-blur-md transition-all ${isSelected ? "shadow-[0_0_40px_rgba(249,115,22,0.4)]" : ""}`}
                >
                  <BrainCircuit
                    size={36}
                    className="text-orange-400 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]"
                  />
                </div>

                <AnimatePresence>
                  {(isSelected || isHovered) && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="draw-handle absolute -top-2 -right-2 w-7 h-7 bg-blue-500 rounded-full border-2 border-[#111625] flex items-center justify-center z-50 text-white hover:bg-blue-400 hover:scale-110 transition-transform cursor-pointer shadow-lg"
                    >
                      <Plus size={16} strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          if (node.type === "title") {
            const isActive = activeDept === node.deptId;
            const isHovered = hoveredDept === node.deptId;
            const isDimmed =
              (activeDept || hoveredDept) && !(isActive || isHovered);
            const displayColor =
              isActive || isHovered ? node.color : "rgba(255,255,255,0.5)";

            return (
              <div
                key={node.id}
                className={`absolute pointer-events-none whitespace-nowrap z-30 transition-all duration-500 ${isDimmed ? "opacity-50" : isActive || isHovered ? "opacity-100 scale-110" : "opacity-100"}`}
                style={{
                  left: node.x,
                  top: node.y,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <h2
                  className="text-2xl font-bold tracking-[0.4em] uppercase"
                  style={{
                    color: displayColor,
                    textShadow:
                      isActive || isHovered ? `0 0 25px ${node.color}` : "none",
                  }}
                >
                  {node.label}
                </h2>
              </div>
            );
          }

          if (node.type === "dept") {
            const isActive = activeDept === node.id;
            const isHovered = hoveredDept === node.id;
            const isDimmed =
              (activeDept || hoveredDept) && !(isActive || isHovered);
            const displayColor =
              isActive || isHovered ? node.color : "rgba(255,255,255,0.5)";

            return (
              <motion.div
                key={node.id}
                className={`absolute flex items-center justify-center rounded-full bg-[#111625] cursor-pointer z-40 transition-opacity duration-500 pointer-events-auto ${isDimmed ? "opacity-50" : "opacity-100"}`}
                style={{ left: node.x, top: node.y }}
                animate={{
                  x: "-50%",
                  y: "-50%",
                  width: isActive ? 72 : 56,
                  height: isActive ? 72 : 56,
                  borderWidth: isActive ? 3 : isHovered ? 2 : 1,
                  borderColor: displayColor,
                  boxShadow: isActive
                    ? `0 0 60px ${node.color}`
                    : isHovered
                      ? `0 0 30px ${node.color}`
                      : "0 0 10px rgba(255,255,255,0.05)",
                }}
                onClick={(e) => handleNodeClick(e, node)}
                onMouseEnter={() => {
                  setHoveredDept(node.id);
                  setHoveredNode(node);
                }}
                onMouseLeave={() => {
                  setHoveredDept(null);
                  setHoveredNode(null);
                }}
              >
                <Database
                  size={isActive ? 32 : 24}
                  style={{ color: displayColor }}
                />

                <AnimatePresence>
                  {(isActive || isHovered) && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="draw-handle absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full border-2 border-[#111625] flex items-center justify-center z-50 text-white hover:bg-blue-400 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          }

          if (
            node.type === "agent" ||
            node.type === "mcp" ||
            node.type === "app"
          ) {
            const isActiveDept = activeDept === node.deptId;
            const isHoveredDept = hoveredDept === node.deptId;
            const isSelected = activeAgent?.id === node.id;
            const isDimmed =
              (activeDept || hoveredDept) && !(isActiveDept || isHoveredDept);
            const isDisabled = node.status === "disabled";
            const isHovered = hoveredNode?.id === node.id;

            let size = 12;
            if (isActiveDept) {
              size = node.type === "mcp" ? 56 : node.type === "app" ? 48 : 44;
            } else if (node.type === "mcp" || node.type === "app") {
              size = 18;
            }

            let nodeColor = "rgba(255,255,255,0.35)";
            if (isDisabled) {
              nodeColor = "#666";
            } else if (isActiveDept || isHoveredDept) {
              nodeColor =
                node.type === "mcp"
                  ? THEME.mcp
                  : node.type === "app"
                    ? "#fff"
                    : node.color;
            } else if (node.type === "mcp") {
              nodeColor = THEME.mcp;
            } else if (node.type === "app") {
              nodeColor = "#fff";
            }

            return (
              <motion.div
                key={node.id}
                className={`absolute flex items-center justify-center bg-[#111625] cursor-pointer transition-opacity duration-500 pointer-events-auto ${node.type === "app" ? "rounded-xl" : "rounded-full"} ${isActiveDept ? "z-50" : "z-20"} ${isDimmed ? "opacity-50" : "opacity-100"}`}
                style={{ left: node.x, top: node.y }}
                animate={{
                  x: "-50%",
                  y: "-50%",
                  width: size,
                  height: size,
                  borderWidth: isActiveDept
                    ? 2
                    : node.type === "mcp" || node.type === "app"
                      ? 2
                      : 0,
                  borderColor: nodeColor,
                  backgroundColor: isSelected
                    ? nodeColor
                    : (node.type === "mcp" || node.type === "app") &&
                        !isActiveDept
                      ? nodeColor
                      : "#111625",
                  boxShadow: isSelected
                    ? `0 0 30px ${nodeColor}`
                    : (isActiveDept || isHoveredDept) && !isDisabled
                      ? `0 0 15px ${nodeColor}80`
                      : "none",
                }}
                onClick={(e) => handleNodeClick(e, node)}
                onMouseEnter={() => {
                  setHoveredDept(node.deptId);
                  setHoveredNode(node);
                }}
                onMouseLeave={() => {
                  setHoveredDept(null);
                  setHoveredNode(null);
                }}
              >
                <AnimatePresence mode="wait">
                  {isActiveDept && (
                    <motion.div
                      key="icon"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                    >
                      <node.icon
                        size={node.type === "mcp" ? 24 : 20}
                        style={{ color: isSelected ? "#111625" : nodeColor }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {isActiveDept && (
                    <motion.div
                      key="label"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: node.type === "mcp" ? 45 : 36 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute whitespace-nowrap text-[11px] font-bold tracking-widest px-3 py-1.5 rounded-md bg-[#1A2133]/95 backdrop-blur-sm border border-white/10 text-white shadow-xl pointer-events-none"
                    >
                      {node.label}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isHovered && isActiveDept && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="draw-handle absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full border-2 border-[#111625] flex items-center justify-center z-50 text-white hover:bg-blue-400 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isActiveDept && node.type === "agent" && (
                  <div
                    className="w-full h-full rounded-full"
                    style={{ backgroundColor: nodeColor }}
                  />
                )}
              </motion.div>
            );
          }

          return null;
        })}
      </motion.div>

      <AnimatePresence>
        {activeAgent && (
          <SidePanel
            node={
              activeAgent.type === "core"
                ? activeAgent
                : agents.find((a) => a.id === activeAgent.id)
            }
            nodesArray={agents}
            onUpdate={setAgents}
            onClose={() => setActiveAgent(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateModal && (
          <CreateNodeModal
            nodesArray={agents}
            drawState={showCreateModal}
            onCancel={() => setShowCreateModal(null)}
            onSave={(result) => {
              if (result.isNewDepartment) {
                setDepartments([...departments, result.department]);
                setShowCreateModal(null);
                // Optional: Auto-pan to the new department logic could go here
              } else {
                const newNode = result.node;
                setAgents([...agents, newNode]);
                setShowCreateModal(null);

                // Auto-select and pan to the newly created node
                setActiveDept(newNode.deptId);
                setActiveAgent(newNode);

                // Wait a tick for the math layout engine to calculate the new X/Y coords
                setTimeout(() => {
                  // This forces React to render first, then we can find the node's new coords
                  setCamera((prev) => {
                    // Note: A true dynamic coordinate tracker would require a ref lookup,
                    // but for this UI, setting activeDept handles the zoom automatically.
                    return { ...prev, scale: 1.2 };
                  });
                }, 100);
              }
            }}
          />
        )}
      </AnimatePresence>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </div>
  );
}
