import React from "react";
import {
  Info,
  AlertTriangle,
  AlertCircle,
  Lightbulb,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";

type NoteVariant = "info" | "warning" | "error" | "tip" | "success";

interface InfoNoteProps {
  variant?: NoteVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const variantConfig: Record<
  NoteVariant,
  {
    icon: LucideIcon;
    bg: string;
    border: string;
    text: string;
    iconColor: string;
  }
> = {
  info: {
    icon: Info,
    bg: "bg-blue-50",
    border: "border-blue-300",
    text: "text-blue-800",
    iconColor: "text-blue-500",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    border: "border-amber-300",
    text: "text-amber-800",
    iconColor: "text-amber-500",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-red-50",
    border: "border-red-300",
    text: "text-red-800",
    iconColor: "text-red-500",
  },
  tip: {
    icon: Lightbulb,
    bg: "bg-purple-50",
    border: "border-purple-300",
    text: "text-purple-800",
    iconColor: "text-purple-500",
  },
  success: {
    icon: CheckCircle,
    bg: "bg-green-50",
    border: "border-green-300",
    text: "text-green-800",
    iconColor: "text-green-500",
  },
};

export const InfoNote: React.FC<InfoNoteProps> = ({
  variant = "info",
  title,
  children,
  className = "",
}) => {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={`flex gap-3 items-start p-4 rounded-lg border ${config.bg} ${config.border} ${className}`}
    >
      <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${config.iconColor}`} />
      <div className={`text-sm ${config.text}`}>
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
};
