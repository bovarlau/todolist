"use client";

import { TaskProvider } from "@/context/TaskContext";
import { Sidebar } from "@/components/sidebar";
import { BottomNav } from "@/components/bottom-nav";
import { TaskList } from "@/components/task-list";
import { SearchBar } from "@/components/search-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { ListTodo } from "lucide-react";

export default function Home() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="md:ml-60 min-h-screen pb-20 md:pb-0">
          <div className="max-w-3xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-end mb-6 md:mb-8">
              <div className="md:hidden flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <ListTodo className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold">TodoList</h1>
              </div>
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
            </div>

            {/* Search */}
            <div className="mb-6">
              <SearchBar />
            </div>

            {/* Task List */}
            <TaskList />
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <BottomNav />
      </div>
    </TaskProvider>
  );
}
