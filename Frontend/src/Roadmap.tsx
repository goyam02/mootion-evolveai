import React, { useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  useNodesState, 
  useEdgesState, 
  MarkerType, 
  Position,
  Handle
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'motion/react';
import { BookOpen, Circle } from 'lucide-react';
import dagre from 'dagre';

const nodeWidth = 280;
const nodeHeight = 90;

const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ 
    rankdir: direction,
    ranksep: 120,
    nodesep: 40,
    marginx: 20,
    marginy: 20 
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

// Custom Node Component
const CustomNode = ({ data, targetPosition, sourcePosition }: any) => {
  const isCompleted = data.status === 'completed';
  const isInProgress = data.status === 'in-progress';
  
  let borderColor = 'border-gray-200';
  let bgColor = 'bg-white';
  let icon = <Circle className="w-5 h-5 text-gray-300" />;
  
  if (isCompleted) {
    borderColor = 'border-gray-800';
    bgColor = 'bg-white';
    icon = <div className="w-5 h-5 rounded-full border-2 border-gray-800 bg-gray-200" />;
  } else if (isInProgress) {
    borderColor = 'border-gray-400';
    bgColor = 'bg-white';
    icon = <div className="w-5 h-5 rounded-full border-2 border-gray-400 bg-gray-100" />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`px-5 py-4 shadow-sm rounded-2xl border-2 ${borderColor} ${bgColor} flex items-center gap-4 w-[280px] cursor-pointer hover:shadow-md transition-shadow`}
    >
      <Handle type="target" position={targetPosition || Position.Top} className="opacity-0" />
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 text-sm leading-tight">{data.label}</h4>
        {data.description && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{data.description}</p>}
      </div>
      <Handle type="source" position={sourcePosition || Position.Bottom} className="opacity-0" />
    </motion.div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export default function Roadmap() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const topic = searchParams.get('topic') || 'Solar System';
  const isSyllabus = searchParams.get('type') === 'syllabus';

  const stateData = location.state?.roadmapData;

  const defaultNodes = [
    { id: 'root', type: 'custom', data: { label: 'Solar System Overview', description: 'Comprehensive guide', status: 'completed' }, position: { x: 0, y: 0 } },

    { id: 'univ', type: 'custom', data: { label: 'Universe', description: 'The expanses of space', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'gal', type: 'custom', data: { label: 'Galaxies', description: 'Systems of stars and dust', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'sta', type: 'custom', data: { label: 'Stars', description: 'Luminous spheres of plasma', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'mw', type: 'custom', data: { label: 'Milky Way', description: 'Our home galaxy', status: 'untouched' }, position: { x: 0, y: 0 } },

    { id: 'ss', type: 'custom', data: { label: 'Solar System', description: 'Our planetary system', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'sun', type: 'custom', data: { label: 'Sun', description: 'The central star', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'pln', type: 'custom', data: { label: 'Planets', description: 'Major celestial bodies', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'ipln', type: 'custom', data: { label: 'Inner Planets', description: 'Terrestrial planets', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'opln', type: 'custom', data: { label: 'Outer Planets', description: 'Gas and ice giants', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'obod', type: 'custom', data: { label: 'Other Bodies', description: 'Smaller celestial objects', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'mo', type: 'custom', data: { label: 'Moons', description: 'Natural satellites', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'ast', type: 'custom', data: { label: 'Asteroids', description: 'Rocky remnants', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'com', type: 'custom', data: { label: 'Comets', description: 'Icy visitors', status: 'untouched' }, position: { x: 0, y: 0 } },

    { id: 'mg', type: 'custom', data: { label: 'Motion & Gravity', description: 'Forces and movements', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'rot', type: 'custom', data: { label: 'Rotation', description: 'Spinning on axis', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'rev', type: 'custom', data: { label: 'Revolution', description: 'Orbiting a body', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'grav', type: 'custom', data: { label: 'Gravity', description: 'Attractive force', status: 'untouched' }, position: { x: 0, y: 0 } },

    { id: 'om', type: 'custom', data: { label: 'Orbital Mechanics', description: 'Physics of orbits', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'co', type: 'custom', data: { label: 'Circular Orbit', description: 'Perfect circle path', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'eo', type: 'custom', data: { label: 'Elliptical Orbit', description: 'Oval-shaped path', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'op', type: 'custom', data: { label: 'Orbital Period', description: 'Time to complete orbit', status: 'untouched' }, position: { x: 0, y: 0 } },

    { id: 'kep', type: 'custom', data: { label: 'Kepler', description: 'Laws of planetary motion', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'k1', type: 'custom', data: { label: 'First Law', description: 'Law of Ellipses', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'k1eo', type: 'custom', data: { label: 'Elliptical Orbit', description: 'Planets move in ellipses', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'k1sf', type: 'custom', data: { label: 'Sun at Focus', description: 'The Sun is at one focus', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'k2', type: 'custom', data: { label: 'Second Law', description: 'Law of Equal Areas', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'k2ea', type: 'custom', data: { label: 'Equal Areas', description: 'Sweeps equal areas', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'k2sc', type: 'custom', data: { label: 'Speed Changes', description: 'Faster near the Sun', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'k3', type: 'custom', data: { label: 'Third Law', description: 'Law of Harmonies', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'k3op', type: 'custom', data: { label: 'Orbital Period', description: 'Square of period', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'k3ds', type: 'custom', data: { label: 'Distance from Sun', description: 'Cube of distance', status: 'untouched' }, position: { x: 0, y: 0 } },

    { id: 'app', type: 'custom', data: { label: 'Applications', description: 'Real-world uses', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'sat', type: 'custom', data: { label: 'Satellites', description: 'Artificial orbits', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'sm', type: 'custom', data: { label: 'Space Missions', description: 'Exploration crafts', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: 'pd', type: 'custom', data: { label: 'Planet Discovery', description: 'Finding exoplanets', status: 'untouched' }, position: { x: 0, y: 0 } }
  ];

  const defaultEdges = [
    { id: 'root-univ', source: 'root', target: 'univ' },
    { id: 'univ-gal', source: 'univ', target: 'gal' },
    { id: 'univ-sta', source: 'univ', target: 'sta' },
    { id: 'univ-mw', source: 'univ', target: 'mw' },

    { id: 'root-ss', source: 'root', target: 'ss' },
    { id: 'ss-sun', source: 'ss', target: 'sun' },
    { id: 'ss-pln', source: 'ss', target: 'pln' },
    { id: 'pln-ipln', source: 'pln', target: 'ipln' },
    { id: 'pln-opln', source: 'pln', target: 'opln' },
    { id: 'ss-obod', source: 'ss', target: 'obod' },
    { id: 'obod-mo', source: 'obod', target: 'mo' },
    { id: 'obod-ast', source: 'obod', target: 'ast' },
    { id: 'obod-com', source: 'obod', target: 'com' },

    { id: 'root-mg', source: 'root', target: 'mg' },
    { id: 'mg-rot', source: 'mg', target: 'rot' },
    { id: 'mg-rev', source: 'mg', target: 'rev' },
    { id: 'mg-grav', source: 'mg', target: 'grav' },

    { id: 'root-om', source: 'root', target: 'om' },
    { id: 'om-co', source: 'om', target: 'co' },
    { id: 'om-eo', source: 'om', target: 'eo' },
    { id: 'om-op', source: 'om', target: 'op' },

    { id: 'root-kep', source: 'root', target: 'kep' },
    { id: 'kep-k1', source: 'kep', target: 'k1' },
    { id: 'k1-k1eo', source: 'k1', target: 'k1eo' },
    { id: 'k1-k1sf', source: 'k1', target: 'k1sf' },
    { id: 'kep-k2', source: 'kep', target: 'k2' },
    { id: 'k2-k2ea', source: 'k2', target: 'k2ea' },
    { id: 'k2-k2sc', source: 'k2', target: 'k2sc' },
    { id: 'kep-k3', source: 'kep', target: 'k3' },
    { id: 'k3-k3op', source: 'k3', target: 'k3op' },
    { id: 'k3-k3ds', source: 'k3', target: 'k3ds' },

    { id: 'root-app', source: 'root', target: 'app' },
    { id: 'app-sat', source: 'app', target: 'sat' },
    { id: 'app-sm', source: 'app', target: 'sm' },
    { id: 'app-pd', source: 'app', target: 'pd' }
  ].map((e: any) => {
      const sourceNode = defaultNodes.find((n: any) => n.id === e.source);
      const isCompleted = sourceNode?.data?.status === 'completed';
      return {
          ...e,
          animated: isCompleted,
          style: { stroke: isCompleted ? '#eab308' : '#d1d5db', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: isCompleted ? '#eab308' : '#d1d5db' }
      };
  });

  const initialNodes = defaultNodes;
      
  const initialEdges = defaultEdges;

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => getLayoutedElements(initialNodes, initialEdges), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onNodeClick = (_: React.MouseEvent, node: any) => {
    navigate(`/concept/${node.id}?topic=${encodeURIComponent(node.data.label)}`);
  };

  return (
    <div className="h-screen w-full bg-[#fafaf8] flex flex-col p-4 md:p-6 lg:p-8 relative overflow-hidden">
      <div className="flex-1 w-full relative z-10 bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden flex flex-col">
        <header className="absolute top-0 left-0 right-0 z-10 px-8 py-6 flex justify-between items-center pointer-events-none">
          <div className="pointer-events-auto">
            <button onClick={() => navigate('/workspace')} className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors group bg-white shadow-sm border border-gray-100">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 group-hover:text-black transition-colors"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
          </div>
          <div className="flex flex-col items-center bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-sm border border-black/5 pointer-events-auto">
             <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">Your Path</span>
             <h1 className="text-xl font-bold text-gray-900 tracking-tight">{isSyllabus ? 'Syllabus Roadmap' : topic}</h1>
          </div>
          <div className="w-10"></div>
        </header>

        <div className="flex-1 w-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.5}
          maxZoom={1.5}
          className="bg-transparent"
        >
          <Background variant="lines" color="#f9fafb" gap={80} size={3} />
          <Controls 
            className="!bg-transparent !border-0 !shadow-none [&>button]:!bg-white [&>button]:!border [&>button]:!border-gray-200 [&>button]:!shadow-sm [&>button]:!rounded-xl [&>button]:!mb-2 [&>button]:!w-8 [&>button]:!h-8" 
            showInteractive={false} 
          />
        </ReactFlow>
      </div>
      
      <motion.div 
         initial={{ x: 20, opacity: 0 }}
         animate={{ x: 0, opacity: 1 }}
         transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
         className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md px-5 py-5 rounded-xl shadow-lg border border-gray-100 flex flex-col gap-4 z-20 pointer-events-auto"
      >
         <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-green-600 bg-green-200" />
            <span className="text-sm font-medium text-gray-600">Completed</span>
         </div>
         <div className="w-full h-px bg-gray-100" />
         <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-yellow-500 bg-yellow-200" />
            <span className="text-sm font-medium text-gray-600">In Progress</span>
         </div>
         <div className="w-full h-px bg-gray-100" />
         <div className="flex items-center gap-3">
            <Circle className="w-4 h-4 text-gray-300" />
            <span className="text-sm font-medium text-gray-600">Up Next</span>
         </div>
      </motion.div>
      </div>
    </div>
  );
}
