"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTasks } from "@/context/TaskContext";
import { Task } from "@/types";
import { TaskItem } from "@/components/task-item";
import { TaskModal } from "@/components/task-modal";
import { Plus, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TaskList() {
  const { filteredTasks, reorderTasks } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderTasks(active.id as string, over.id as string);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  return (
    <>
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <ListTodo className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-muted-foreground">
              No tasks yet
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Click the button below to add your first task
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredTasks.map(t => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TaskItem task={task} onEdit={handleEdit} />
                </div>
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Floating Add Button (Desktop) */}
      <div className="hidden md:block mt-6">
        <Button
          onClick={handleAdd}
          className="w-full py-6 text-base bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02]"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Floating Add Button (Mobile) */}
      <button
        onClick={handleAdd}
        className="md:hidden fixed bottom-20 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50"
        aria-label="Add task"
      >
        <Plus className="h-6 w-6" />
      </button>

      <TaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editTask={editingTask}
      />
    </>
  );
}
