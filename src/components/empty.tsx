import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function Empty({ icon: Icon, title, description }: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 shadow-inner">
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600 max-w-md font-medium">{description}</p>
    </div>
  );
}

