import React, { useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
import { BookOpen, CheckCircle2, Circle } from 'lucide-react';
import dagre from 'dagre';

const nodeWidth = 280;
const nodeHeight = 90;

const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

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
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

// Custom Node Component
const CustomNode = ({ data }: any) => {
  const isCompleted = data.status === 'completed';
  const isInProgress = data.status === 'in-progress';
  
  let borderColor = 'border-gray-200';
  let bgColor = 'bg-white';
  let icon = <Circle className="w-5 h-5 text-gray-300" />;
  
  if (isCompleted) {
    borderColor = 'border-green-500';
    bgColor = 'bg-green-50';
    icon = <CheckCircle2 className="w-5 h-5 text-green-600" />;
  } else if (isInProgress) {
    borderColor = 'border-yellow-400';
    bgColor = 'bg-yellow-50';
    icon = <div className="w-5 h-5 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`px-5 py-4 shadow-sm rounded-2xl border-2 ${borderColor} ${bgColor} flex items-center gap-4 w-[280px] cursor-pointer hover:shadow-md transition-shadow`}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 text-sm leading-tight">{data.label}</h4>
        {data.description && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{data.description}</p>}
      </div>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </motion.div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export default function Roadmap() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const topic = searchParams.get('topic') || 'Machine Learning';
  const isSyllabus = searchParams.get('type') === 'syllabus';

  const initialNodes = [
    { id: '1', type: 'custom', data: { label: `Introduction to ${topic}`, description: 'Core concepts and history', status: 'completed' }, position: { x: 0, y: 0 } },
    { id: '2', type: 'custom', data: { label: 'Foundational Principles', description: 'The math and logic behind it', status: 'in-progress' }, position: { x: 0, y: 0 } },
    { id: '3', type: 'custom', data: { label: 'Advanced Topics', description: 'Deep dive into complex areas', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: '4', type: 'custom', data: { label: 'Practical Applications', description: 'Real-world use cases', status: 'untouched' }, position: { x: 0, y: 0 } },
    { id: '5', type: 'custom', data: { label: 'Future Trends', description: 'Where the field is heading', status: 'untouched' }, position: { x: 0, y: 0 } }
  ];

  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#eab308', strokeWidth: 2 } },
    { id: 'e2-3', source: '2', target: '3', markerEnd: { type: MarkerType.ArrowClosed, color: '#d1d5db' }, style: { stroke: '#d1d5db', strokeWidth: 2 } },
    { id: 'e2-4', source: '2', target: '4', markerEnd: { type: MarkerType.ArrowClosed, color: '#d1d5db' }, style: { stroke: '#d1d5db', strokeWidth: 2 } },
    { id: 'e3-5', source: '3', target: '5', markerEnd: { type: MarkerType.ArrowClosed, color: '#d1d5db' }, style: { stroke: '#d1d5db', strokeWidth: 2 } },
    { id: 'e4-5', source: '4', target: '5', markerEnd: { type: MarkerType.ArrowClosed, color: '#d1d5db' }, style: { stroke: '#d1d5db', strokeWidth: 2 } },
  ];

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => getLayoutedElements(initialNodes, initialEdges), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onNodeClick = (_: React.MouseEvent, node: any) => {
    navigate(`/concept/${node.id}?topic=${encodeURIComponent(node.data.label)}`);
  };

  return (
    <div className="h-screen w-full bg-black flex flex-col p-4 md:p-6 lg:p-8 relative">
      <div className="flex-1 w-full relative bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
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
          <Background color="#d1d5db" gap={24} size={2} />
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
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Completed</span>
         </div>
         <div className="w-full h-px bg-gray-100" />
         <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />
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
