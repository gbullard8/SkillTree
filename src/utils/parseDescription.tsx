import React from 'react';

// Splits a plain text string into React nodes, inserting <br /> for each \n.
function pushText(text: string, nodes: React.ReactNode[], counter: { i: number }) {
  const parts = text.split('\n');
  parts.forEach((part, idx) => {
    if (part) nodes.push(part);
    if (idx < parts.length - 1) nodes.push(<br key={`br-${counter.i++}`} />);
  });
}

// Splits a description into rendered React nodes and collects status effect names.
// @text@        → golden highlighted span
// {STA=Name}    → inline "Name" (golden), collected for status section
export function parseDescription(desc: string): {
  nodes: React.ReactNode[];
  statuses: string[];
} {
  const statuses: string[] = [];
  const nodes: React.ReactNode[] = [];

  // Token pattern: @...@ or {STA=...}
  const pattern = /@([^@]+)@|\{STA=([^}]+)\}/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  const counter = { i: 0 };

  while ((match = pattern.exec(desc)) !== null) {
    // Plain text before this token
    if (match.index > last) {
      pushText(desc.slice(last, match.index), nodes, counter);
    }

    if (match[1] !== undefined) {
      // @text@ → highlighted; also collect if it's a known status name
      const atName = match[1];
      if (!statuses.includes(atName)) statuses.push(atName);
      nodes.push(
        <span key={i++} style={{ color: '#e8c87a' }}>{atName}</span>
      );
    } else if (match[2] !== undefined) {
      // {STA=Name} → inline name + collect
      const name = match[2];
      if (!statuses.includes(name)) statuses.push(name);
      nodes.push(
        <span key={i++} style={{ color: '#e8c87a' }}>{name}</span>
      );
    }

    last = match.index + match[0].length;
  }

  // Remaining plain text
  if (last < desc.length) {
    pushText(desc.slice(last), nodes, counter);
  }

  return { nodes, statuses };
}
