import React from 'react';

// Adds plain text while preserving line breaks as React nodes.
function pushText(
  text: string,
  nodes: React.ReactNode[],
  counter: { i: number },
  className?: string
) {
  const parts = text.split('\n');

  parts.forEach((part, idx) => {
    if (part) {
      nodes.push(
        className
          ? <span key={`text-${counter.i++}`} className={className}>{part}</span>
          : part
      );
    }

    if (idx < parts.length - 1) {
      nodes.push(<br key={`br-${counter.i++}`} />);
    }
  });
}

// Converts Stolen Realm markup into tooltip nodes and collected status names.
export function parseDescription(desc: string): {
  nodes: React.ReactNode[];
  statuses: string[];
} {
  const statuses: string[] = [];
  const nodes: React.ReactNode[] = [];
  // Matches status markers and highlighted values from exported descriptions.
  const pattern = /@([^@]+)@|\{STA=([^}]+)\}|\{HL=([^}]+)\}/g;
  // Preserve paragraph breaks while scanning markup inside each section.
  const sections = desc.split(/(\n{2,})/);
  const counter = { i: 0 };

  sections.forEach((section) => {
    if (/^\n+$/.test(section)) {
      pushText(section, nodes, counter);
      return;
    }

    let last = 0;
    let match: RegExpExecArray | null;
    pattern.lastIndex = 0;

    while ((match = pattern.exec(section)) !== null) {
      if (match.index > last) {
        pushText(section.slice(last, match.index), nodes, counter);
      }

      if (match[1] !== undefined) {
        const atName = match[1];
        if (!statuses.includes(atName)) statuses.push(atName);
        nodes.push(<span key={`hl-${counter.i++}`} className="tooltip-highlight">{atName}</span>);
      } else if (match[2] !== undefined) {
        const name = match[2];
        if (!statuses.includes(name)) statuses.push(name);
        nodes.push(<span key={`hl-${counter.i++}`} className="tooltip-highlight">{name}</span>);
      } else if (match[3] !== undefined) {
        nodes.push(
          <span key={`hl-${counter.i++}`} className="tooltip-highlight tooltip-highlight-number">
            {match[3]}
          </span>
        );
      }

      last = match.index + match[0].length;
    }

    if (last < section.length) {
      pushText(section.slice(last), nodes, counter);
    }
  });

  return { nodes, statuses };
}
