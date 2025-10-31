"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/utils";

export const Tabs = TabsPrimitive.Root;

export const TabsList = ({ className, ...props }: any) => (
  <TabsPrimitive.List
    className={cn(
      "inline-flex items-center justify-start rounded-lg bg-gray-100 p-1 mb-4 overflow-x-auto",
      className
    )}
    {...props}
  />
);

export const TabsTrigger = ({ className, ...props }: any) => (
  <TabsPrimitive.Trigger
    className={cn(
      "flex-1 px-4 py-2 text-sm font-medium text-gray-600 rounded-md transition-all",
      "data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow",
      "hover:bg-blue-50 hover:text-blue-600 whitespace-nowrap",
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
