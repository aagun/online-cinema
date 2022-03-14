import React from 'react';

export default function Text({ children }) {
  return (
    <p className="text-muted fw-bold" style={{ fontSize: 18 }}>
      {children}
    </p>
  );
}
