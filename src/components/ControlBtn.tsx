"use client";

import React from "react";

export default function ControlBtn({
  onClick,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      className="flex size-8 md:size-10 flex-shrink-0 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:scale-110 hover:bg-black/50 border border-purple-500/20"
      {...rest}
    >
      {children}
    </button>
  );
}
