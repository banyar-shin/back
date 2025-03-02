"use client";

import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, CheckSquare, Clock, AlertTriangle, Filter, X } from "lucide-react";
import { useUser } from '@clerk/clerk-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the Task interface
interface Task {
  _id: string; // MongoDB ObjectId as string
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
    _id: "60d21b4667d0d8992e610c85",
    timestamp: "2025-03-02 14:35",
    description: "CS-122 Homework 5",
    priority: "High",
    category: "School",
    due_date: "2025-03-03 14:35",
    status: "Incomplete"
  },
  {
    _id: "60d21b4667d0d8992e610c86",
    timestamp: "2025-03-01 09:15",
    description: "Call with client",
    priority: "Medium",
    category: "Work",
    due_date: "2025-03-03 10:00",
    status: "Incomplete"
  },
  {
    _id: "60d21b4667d0d8992e610c87",
    timestamp: "2025-02-28 18:30",
    description: "Grocery shopping",
    priority: "Low",
    category: "Personal",
    due_date: "2025-03-03 20:00",
    status: "Complete"
  },
  {
    _id: "60d21b4667d0d8992e610c88",
    timestamp: "2025-03-01 12:00",
    description: "Prepare presentation",
    priority: "High",
    category: "Work",
    due_date: "2025-03-04 09:00",
    status: "Incomplete"
  },
  {
    _id: "60d21b4667d0d8992e610c89",
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
    // Handle case where date might be null, undefined, or "None" (from Python)
    if (!dateString || dateString === "None" || dateString === "null") {
      console.log('Received empty date value:', dateString);
      return new Date();
    }

    // Check if the date is already a valid ISO string
    if (dateString.includes('T') && !isNaN(Date.parse(dateString))) {
      return parseISO(dateString);
    }

    // Check if it's a simple date string (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return parseISO(dateString);
    }

    // Handle format: "2025-03-04 14:35"
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(dateString)) {
      return new Date(dateString.replace(' ', 'T'));
    }

    // Try direct parsing as a fallback
    const directParse = new Date(dateString);
    if (!isNaN(directParse.getTime())) {
      return directParse;
    }

    // If all else fails, return current date
    console.error('Could not parse date format:', dateString);
    return new Date();
  } catch (error) {
    console.error('Error parsing date:', dateString, error);
    return new Date(); // Return current date as fallback
  }
};

export default function TasksPage() {
  const { user, isLoaded } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [hideCompleted, setHideCompleted] = useState(false);

  // Add filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

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

      // Use the Next.js API route
      const response = await fetch(`/api/tasks?user_id=${encodeURIComponent(user.id)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
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
  const markAsComplete = async (task: Task) => {
    try {
      // Set the completing task ID to show loading state
      setCompletingTaskId(task._id);

      // Create form data for the request
      const formData = new FormData();
      formData.append('user_id', user?.id || '');
      formData.append('task_id', task._id);

      // Call the Next.js API route
      const response = await fetch('/api/tasks/complete', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to mark task as complete: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        // Update the local state
        const updatedTasks = [...tasks];
        const taskIndex = findTaskIndex(task);
        if (taskIndex !== -1) {
          updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], status: "Complete" };
          setTasks(updatedTasks);
        }
      } else {
        console.error('Error marking task as complete:', result.message);
      }
    } catch (error) {
      console.error('Error marking task as complete:', error);
    } finally {
      // Clear the completing task ID
      setCompletingTaskId(null);
    }
  };

  // Function to find task index by matching properties
  const findTaskIndex = (task: Task) => {
    return tasks.findIndex(t => t._id === task._id);
  };

  // Get unique categories and priorities from tasks
  const uniqueCategories = Array.from(new Set(tasks.map(task => task.category)));
  const priorities = ["High", "Medium", "Low"];

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Toggle priority selection
  const togglePriority = (priority: string) => {
    setSelectedPriorities(prev =>
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriorities([]);
  };

  // Sort tasks by status (incomplete first) and then by due date
  const sortedTasks = [...tasks].sort((a, b) => {
    // First sort by status (incomplete first)
    if (a.status === "Incomplete" && b.status === "Complete") return -1;
    if (a.status === "Complete" && b.status === "Incomplete") return 1;

    // Then sort by due date - using our custom parse function
    return parseDate(a.due_date).getTime() - parseDate(b.due_date).getTime();
  });

  // Apply all filters
  const filteredTasks = sortedTasks
    .filter(task => hideCompleted ? task.status === "Incomplete" : true)
    .filter(task => selectedCategories.length > 0 ? selectedCategories.includes(task.category) : true)
    .filter(task => selectedPriorities.length > 0 ? selectedPriorities.includes(task.priority) : true);

  // Group tasks by due date
  const groupedTasks: Record<string, Task[]> = {};
  const completedTasks: Task[] = [];

  filteredTasks.forEach(task => {
    // If task is complete and we're showing completed tasks, add to completed section
    if (task.status === "Complete") {
      completedTasks.push(task);
      return;
    }

    // Otherwise group by due date as before
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setHideCompleted(!hideCompleted)}
          >
            {hideCompleted ? 'Show Completed' : 'Hide Completed'}
          </Button>

          <Button variant="outline" onClick={fetchTasks} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-muted/30 rounded-lg p-4 border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Tasks
          </h3>
          {(selectedCategories.length > 0 || selectedPriorities.length > 0) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Clear All Filters
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                Category
                {selectedCategories.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{selectedCategories.length}</Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {uniqueCategories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Priority Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                Priority
                {selectedPriorities.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{selectedPriorities.length}</Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {priorities.map((priority) => (
                <DropdownMenuCheckboxItem
                  key={priority}
                  checked={selectedPriorities.includes(priority)}
                  onCheckedChange={() => togglePriority(priority)}
                >
                  {priority}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Active Filters Display */}
          {(selectedCategories.length > 0 || selectedPriorities.length > 0) && (
            <div className="flex items-center gap-2 ml-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              <div className="flex flex-wrap gap-1">
                {selectedCategories.map(category => (
                  <Badge key={`cat-${category}`} variant="outline" className="flex items-center gap-1">
                    {category}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => toggleCategory(category)}
                    />
                  </Badge>
                ))}
                {selectedPriorities.map(priority => (
                  <Badge key={`pri-${priority}`} variant="outline" className="flex items-center gap-1">
                    {priority}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => togglePriority(priority)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {dueDateKeys.map(dateKey => (
          <div key={dateKey} className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {format(new Date(dateKey), 'MMMM d, yyyy')}
            </h3>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {groupedTasks[dateKey].map((task) => (
                <Card key={task._id} className={`${task.status === "Complete" ? "opacity-60" : ""}`}>
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
                          onClick={() => markAsComplete(task)}
                          disabled={completingTaskId === task._id}
                        >
                          {completingTaskId === task._id ? "Marking Done..." : "Mark Done"}
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Completed Tasks Section */}
        {!hideCompleted && completedTasks.length > 0 && (
          <div className="space-y-4 mt-8 border-t pt-8">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Completed Tasks
            </h3>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {completedTasks.map((task) => (
                <Card key={task._id} className="opacity-60 bg-muted/30">
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
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" /> Complete
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="w-full flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Due: {format(parseDate(task.due_date), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
