"use client";

import { useTasks } from "@/context/TaskContext";
import { FilterType } from "@/types";
import { CalendarDays, Star, CheckCircle, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const filters: { id: FilterType; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All Tasks', icon: ListTodo },
  { id: 'today', label: 'Today', icon: CalendarDays },
  { id: 'important', label: 'Important', icon: Star },
  { id: 'completed', label: 'Completed', icon: CheckCircle },
];

export function Sidebar() {
  const { filter, setFilter, tasks } = useTasks();

  const getCounts = (filterId: FilterType) => {
    const today = new Date();
    return tasks.filter(task => {
      switch (filterId) {
        case 'all':
          return !task.completed;
        case 'today':
          if (!task.dueDate) return false;
          const d = new Date(task.dueDate);
          return d.getDate() === today.getDate() &&
                 d.getMonth() === today.getMonth() &&
                 d.getFullYear() === today.getFullYear() &&
                 !task.completed;
        case 'important':
          return task.important && !task.completed;
        case 'completed':
          return task.completed;
        default:
          return true;
      }
    }).length;
  };

  return (
    <aside className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 border-r border-border bg-background/50 backdrop-blur-sm p-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <ListTodo className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold">TodoList</h1>
      </div>

      <nav className="flex-1 space-y-1">
        {filters.map((item) => {
          const Icon = item.icon;
          const count = getCounts(item.id);
          return (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                filter === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                {item.label}
              </div>
              {count > 0 && (
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  filter === item.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-border">
        <ThemeToggle />
      </div>
    </aside>
  );
}
