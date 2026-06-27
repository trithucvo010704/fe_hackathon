'use client';

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true
  }
});

interface MermaidViewerProps {
  chart: string;
}

export default function MermaidViewer({ chart }: MermaidViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgHtml, setSvgHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let isMounted = true;
    const elementId = `mermaid-${Math.floor(Math.random() * 1000000)}`;

    const renderChart = async () => {
      try {
        setError(null);
        // Clean chart formatting and sanitize syntax errors (e.g., escaped double quotes inside HTML attributes)
        let cleanChart = chart.trim().split('\n').map(line => {
          return line.replace(/([\[\(\>\{]+)\s*\\?"(.*?)\\?"\s*([\]\)\}\>]+)/g, (match, open, content, close) => {
            const cleanContent = content
              .replace(/\\"/g, "'")
              .replace(/"/g, "'");
            return `${open}"${cleanContent}"${close}`;
          });
        }).join('\n');

        // Backup: replace any remaining unhandled \" or \\" with clean double quotes
        cleanChart = cleanChart.replace(/\\"/g, '"');

        const { svg } = await mermaid.render(elementId, cleanChart);
        
        if (isMounted) {
          setSvgHtml(svg);
        }
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        // Clean DOM in case mermaid leaves error element
        const badElement = document.getElementById(elementId);
        if (badElement) {
          badElement.remove();
        }
        
        if (isMounted) {
          setError('Không thể render sơ đồ. Vui lòng kiểm tra cú pháp Mermaid.');
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, isClient]);

  if (!isClient) {
    return (
      <pre style={{
        padding: '16px',
        borderRadius: '6px',
        backgroundColor: 'var(--background)',
        border: '1px solid var(--border)',
        overflowX: 'auto',
        fontSize: '13px'
      }}>
        <code>{chart}</code>
      </pre>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '16px',
        borderRadius: '6px',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid #ef4444',
        color: '#ef4444',
        margin: '12px 0',
        fontSize: '13px'
      }}>
        <p style={{ margin: 0, fontWeight: '600' }}>Lỗi Render Sơ Đồ:</p>
        <pre style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap', fontSize: '12px' }}>{chart}</pre>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="mermaid-container" 
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#ffffff', // White background so SVG chart is fully visible and readable
        border: '1px solid var(--border)',
        margin: '16px 0',
        overflowX: 'auto',
        maxWidth: '100%'
      }}
      dangerouslySetInnerHTML={{ __html: svgHtml || '<span style="color: var(--text-secondary)">Đang vẽ sơ đồ...</span>' }}
    />
  );
}
