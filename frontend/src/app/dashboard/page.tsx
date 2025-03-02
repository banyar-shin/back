"use client";

import React from "react";
import Link from "next/link";
import { CheckSquare, MessageSquare, ArrowRight, Home } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex flex-col w-full items-center justify-center p-6">
      <div className="flex w-full max-w-4xl flex-col items-center space-y-8">
        <div className="text-center w-full">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2 justify-center">
            <Home className="h-7 w-7" />
            Welcome to GYST AI
          </h2>

          <div className="text-lg text-muted-foreground mt-4">
            <p>Select a feature below to get started with organizing your work and studies.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 w-full md:max-w-4xl">
          {/* Tasks Card */}
          <Card className="relative overflow-hidden border-2 transition-all hover:border-primary hover:shadow-lg">
            <CardHeader className="pb-2 px-6 pt-6">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Task Management</CardTitle>
              </div>
              <CardDescription className="text-base">
                Organize and track your tasks by priority and due date
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-0 px-6">
              <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                <li>View all your tasks organized by due date</li>
                <li>Mark tasks as complete with a single click</li>
                <li>Filter and sort tasks by priority or category</li>
                <li>Stay on top of deadlines with visual indicators</li>
              </ul>
            </CardContent>
            <CardFooter className="flex justify-end pt-6 pb-6 px-6">
              <Button asChild>
                <Link href="/dashboard/tasks" className="flex items-center gap-2">
                  Go to Tasks <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Chatbot Card */}
          <Card className="relative overflow-hidden border-2 transition-all hover:border-primary hover:shadow-lg">
            <CardHeader className="pb-2 px-6 pt-6">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">AI Assistant</CardTitle>
              </div>
              <CardDescription className="text-base">
                Get help and answers from our intelligent chatbot
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-0 px-6">
              <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                <li>Ask questions about your tasks and deadlines</li>
                <li>Get suggestions for managing your workload</li>
                <li>Receive personalized productivity tips</li>
                <li>Quick access to information and guidance</li>
              </ul>
            </CardContent>
            <CardFooter className="flex justify-end pt-6 pb-6 px-6">
              <Button asChild>
                <Link href="/dashboard/chatbot" className="flex items-center gap-2">
                  Open Chatbot <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 rounded-lg bg-muted p-6 w-full md:max-w-4xl">
          <h3 className="mb-4 text-xl font-medium text-center">Getting Started</h3>
          <p className="text-muted-foreground text-center">
            GYST AI (Get Your Stuff Together) helps you stay organized and focused. Start by adding your tasks and
            deadlines in the Task Management section. If you need assistance or have questions, our AI chatbot is ready to help.
          </p>
        </div>
      </div>
    </div>
  );
}
