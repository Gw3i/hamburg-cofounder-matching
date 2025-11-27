import { Component } from "lucide-react";

interface LogoIconProps {
  className?: string;
}

export function LogoIcon({ className = "h-6 w-6" }: LogoIconProps) {
  return <Component className={className} />;
}
