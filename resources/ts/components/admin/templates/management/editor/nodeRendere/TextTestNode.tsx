import { NodeProps, Handle, Position } from '@xyflow/react';
import { useEffect } from 'react';

interface TextNodeData {
  text: string;
  fontSize?: number;
  color?: string;
  fontFamily?: 'Cairo' | 'Reem Kufi Ink';
}

type TextNodeProps = NodeProps & {
  data: TextNodeData;
};

const TextTestNode = ({ data }: TextNodeProps) => {
  useEffect(() => {
    // Load Google Fonts dynamically
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cairo&family=Reem+Kufi+Ink&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const style = {
    fontSize: `${data.fontSize ?? 16}px`,
    color: data.color ?? '#000000',
    fontFamily: data.fontFamily ?? 'Cairo',
    padding: '10px',
    border: '1px solid #eee',
    borderRadius: '5px',
    backgroundColor: 'white'
  };

  return (
    <div style={style}>
      <Handle type="target" position={Position.Top} />
      {data.text}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default TextTestNode;