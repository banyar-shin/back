"use client";

import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, CheckSquare, Clock, AlertTriangle } from "lucide-react";
import { useUser } from '@clerk/clerk-react';

// Define the Task interface
interface Task {
  timestamp: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  category: string;
  due_date: string;
  status: "Complete" | "Incomplete";
}

// Dummy data for tasks
const dummyTasks: Task[] = [
  {
    timestamp: "2025-03-02 14:35",
    description: "CS-122 Homework 5",
    priority: "High",
    category: "School",
    due_date: "2025-03-03 14:35",
    status: "Incomplete"
  },
  {
    timestamp: "2025-03-01 09:15",
    description: "Call with client",
    priority: "Medium",
    category: "Work",
    due_date: "2025-03-03 10:00",
    status: "Incomplete"
  },
  {
    timestamp: "2025-02-28 18:30",
    description: "Grocery shopping",
    priority: "Low",
    category: "Personal",
    due_date: "2025-03-03 20:00",
    status: "Complete"
  },
  {
    timestamp: "2025-03-01 12:00",
    description: "Prepare presentation",
    priority: "High",
    category: "Work",
    due_date: "2025-03-04 09:00",
    status: "Incomplete"
  },
  {
    timestamp: "2025-02-27 14:20",
    description: "Dentist appointment",
    priority: "Medium",
    category: "Health",
    due_date: "2025-03-03 15:30",
    status: "Incomplete"
  }
];

// Function to get priority badge color
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-500";
    case "Medium":
      return "bg-yellow-500";
    case "Low":
      return "bg-green-500";
    default:
      return "bg-blue-500";
  }
};

// Function to get category badge variant
const getCategoryVariant = (category: string) => {
  switch (category) {
    case "School":
      return "outline";
    case "Work":
      return "secondary";
    case "Personal":
      return "default";
    case "Health":
      return "destructive";
    default:
      return "default";
  }
};

// Function to parse the date format coming from the backend
const parseDate = (dateString: string) => {
  try {
    // Handle case where date might be null or undefined
    if (!dateString) return new Date();

    // Input format: "2025-03-04 14:35"
    return new Date(dateString.replace(' ', 'T'));
  } catch (error) {
    console.error('Error parsing date:', dateString, error);
    return new Date(); // Return current date as fallback
  }
};

export default function TasksPage() {
  const { user, isLoaded } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch tasks when user is loaded
    if (isLoaded && user) {
      fetchTasks();
    }
  }, [isLoaded, user]); // Re-run when user loads

  const fetchTasks = async () => {
    try {
      setLoading(true);

      // Use the client-side user object instead of server auth
      if (!user || !user.id) {
        console.error('User not authenticated');
        setLoading(false);
        return;
      }

      console.log('Fetching tasks for user:', user.id);

      // Updated fetch request with explicit CORS handling
      const response = await fetch(`http://localhost:5000/tasks/?user_id=${encodeURIComponent(user.id)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
      }

      try {
        const data = await response.json();
        console.log('Received data:', data);

        // Ensure data is properly parsed if it's a string
        let parsedData = data;
        if (typeof data === 'string') {
          try {
            parsedData = JSON.parse(data);
            console.log('Parsed string data:', parsedData);
          } catch (parseError) {
            console.error('Error parsing string data:', parseError);
          }
        }

        console.log('Data type:', typeof parsedData);

        // Safely check for tasks property
        const hasTasks = parsedData && typeof parsedData === 'object' && 'tasks' in parsedData;
        console.log('Has tasks property:', hasTasks);

        if (hasTasks && Array.isArray(parsedData.tasks)) {
          console.log('Setting tasks from data.tasks:', parsedData.tasks);
          setTasks(parsedData.tasks);
        } else if (Array.isArray(parsedData)) {
          console.log('Setting tasks from array data:', parsedData);
          setTasks(parsedData);
        } else {
          console.error('Unexpected data format, using dummy data for now:', parsedData);
          // Use dummy data since we're having issues with the backend data
          setTasks(dummyTasks);
        }
      } catch (jsonError: unknown) {
        console.error('Error parsing JSON:', jsonError);

        // Try to manually parse the response text as a fallback
        try {
          const text = await response.text();
          console.log('Raw response text:', text);

          // Try to manually extract the tasks array using regex if needed
          if (text.includes('"tasks":')) {
            try {
              // Use a regex pattern without the 's' flag for better compatibility
              const tasksMatch = text.match(/"tasks":\s*(\[[\s\S]*?\])/);
              if (tasksMatch && tasksMatch[1]) {
                const tasksJson = tasksMatch[1];
                const extractedTasks = JSON.parse(tasksJson);
                console.log('Extracted tasks using regex:', extractedTasks);
                if (Array.isArray(extractedTasks)) {
                  setTasks(extractedTasks);
                  return; // Exit early if successful
                }
              }
            } catch (regexError) {
              console.error('Error extracting tasks with regex:', regexError);
            }
          }

          // Fallback to dummy data
          console.log('Using dummy data as fallback');
          setTasks(dummyTasks);
        } catch (textError) {
          console.error('Error reading response text:', textError);
          setTasks([]); // Set empty array as last resort
        }
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return <div>Loading...</div>;
  }

  // Function to mark a task as complete
  const markAsComplete = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], status: "Complete" };
    setTasks(updatedTasks);
  };

  // Function to find task index by matching properties
  const findTaskIndex = (task: Task) => {
    return tasks.findIndex(t =>
      t.description === task.description &&
      t.timestamp === task.timestamp &&
      t.due_date === task.due_date
    );
  };

  // Sort tasks by due date (closest first) and incomplete status
  const sortedTasks = [...tasks].sort((a, b) => {
    // First sort by status (incomplete first)
    if (a.status === "Incomplete" && b.status === "Complete") return -1;
    if (a.status === "Complete" && b.status === "Incomplete") return 1;

    // Then sort by due date - using our custom parse function
    return parseDate(a.due_date).getTime() - parseDate(b.due_date).getTime();
  });

  // Group tasks by due date
  const groupedTasks: Record<string, Task[]> = {};

  sortedTasks.forEach(task => {
    // Format the date to just show YYYY-MM-DD for grouping
    const dueDate = format(parseDate(task.due_date), 'yyyy-MM-dd');
    if (!groupedTasks[dueDate]) {
      groupedTasks[dueDate] = [];
    }
    groupedTasks[dueDate].push(task);
  });

  // Get due date keys and sort them
  const dueDateKeys = Object.keys(groupedTasks).sort((a, b) =>
    new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="flex-col space-y-6 p-6">
      <div className="flex-col items-center justify-between space-y-2 md:flex md:flex-row">
        <div className="w-full text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2 justify-center md:justify-start">
            <CheckSquare className="h-7 w-7" />
            Tasks
          </h2>
        </div>
        <Button>Add New Task</Button>
      </div>

      <div className="space-y-8">
        {dueDateKeys.map(dateKey => (
          <div key={dateKey} className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {format(new Date(dateKey), 'MMMM d, yyyy')}
            </h3>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {groupedTasks[dateKey].map((task, index) => (
                <Card key={`${task.description}-${index}`} className={`${task.status === "Complete" ? "opacity-60" : ""}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{task.description}</CardTitle>
                      <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                        {task.priority}
                      </Badge>
                    </div>
                    <CardDescription>
                      Created: {format(parseDate(task.timestamp), 'MMM d, yyyy h:mm a')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between items-center">
                      <Badge variant={getCategoryVariant(task.category) as any}>
                        {task.category}
                      </Badge>
                      <div className="flex items-center text-sm">
                        {task.status === "Complete" ? (
                          <span className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" /> Complete
                          </span>
                        ) : (
                          <span className="flex items-center text-amber-600">
                            <AlertTriangle className="h-4 w-4 mr-1" /> Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="w-full flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Due: {format(parseDate(task.due_date), 'MMM d, yyyy h:mm a')}
                      </span>
                      {task.status === "Incomplete" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-auto"
                          onClick={() => markAsComplete(findTaskIndex(task))}
                        >
                          Mark Done
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
