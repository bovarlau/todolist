"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types";
import { useTasks } from "@/context/TaskContext";
import { Star, Pencil, Trash2, GripVertical, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { formatDate, cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const { toggleComplete, toggleImportant, deleteTask } = useTasks();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TooltipProvider>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "glass-card p-4 group",
          isDragging && "opacity-50 rotate-1 scale-105 z-50 shadow-2xl"
        )}
      >
        <div className="flex items-start gap-3">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-5 w-5" />
          </button>

          {/* Checkbox */}
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleComplete(task.id)}
            className="mt-0.5"
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "font-medium text-base",
                  task.completed && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </span>
              {task.important && (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              )}
            </div>

            {task.description && (
              <div className="mt-1 text-sm text-muted-foreground markdown-content">
                <ReactMarkdown>{task.description}</ReactMarkdown>
              </div>
            )}

            {task.dueDate && (
              <div className={cn(
                "mt-2 flex items-center gap-1 text-xs",
                new Date(task.dueDate) < new Date() && !task.completed
                  ? "text-red-500"
                  : "text-muted-foreground"
              )}>
                <Calendar className="h-3 w-3" />
                {formatDate(task.dueDate)}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onEdit(task)}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                  aria-label="Edit task"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => toggleImportant(task.id)}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                  aria-label={task.important ? "Remove important" : "Mark important"}
                >
                  <Star className={cn(
                    "h-4 w-4",
                    task.important && "fill-yellow-400 text-yellow-400"
                  )} />
                </button>
              </TooltipTrigger>
              <TooltipContent>{task.important ? 'Remove important' : 'Mark important'}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 rounded-lg hover:bg-accent transition-colors text-red-500 hover:text-red-600"
                  aria-label="Delete task"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
