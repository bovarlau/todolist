"use client";

import { useTasks } from "@/context/TaskContext";
import { FilterType } from "@/types";
import { CalendarDays, Star, CheckCircle, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

const filters: { id: FilterType; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All', icon: ListTodo },
  { id: 'today', label: 'Today', icon: CalendarDays },
  { id: 'important', label: 'Star', icon: Star },
  { id: 'completed', label: 'Done', icon: CheckCircle },
];

export function BottomNav() {
  const { filter, setFilter } = useTasks();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-lg p-2 z-50">
      <div className="flex justify-around">
        {filters.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-all",
                filter === item.id
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
