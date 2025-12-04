"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/libs/utils";

export const Tabs = TabsPrimitive.Root;

export const TabsList = ({ className, ...props }: any) => (
  <TabsPrimitive.List
    className={cn(
      "flex flex-wrap gap-2 rounded-2xl bg-white/80 border border-gray-200 p-3 shadow-sm mb-4",
      className
    )}
    {...props}
  />
);

export const TabsTrigger = ({ className, ...props }: any) => (
  <TabsPrimitive.Trigger
    className={cn(
      "px-5 py-2 text-sm font-semibold text-gray-600 rounded-xl border border-transparent transition-all w-full",
      "data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg",
      "hover:border-blue-200 hover:text-blue-700 whitespace-nowrap",
      className
    )}
    {...props}
  />
);

export const TabsContent = ({ className, ...props }: any) => (
  <TabsPrimitive.Content
    className={cn("mt-2 focus:outline-none", className)}
    {...props}
  />
);
