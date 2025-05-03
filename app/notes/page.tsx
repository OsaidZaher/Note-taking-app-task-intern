"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Trash2, LogOut, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";
import { Progress } from "@/components/ui/progress";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

// Function to decode JWT token
function getTokenExpiryTime(token: string | null): number | null {
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(base64));

    return payload.exp || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

// JWT Timer Component, I have a timer component made in my full stack web app so I copied it and edited it to use JWT token
function JWTExpiryTimer() {
  const [expiryTime, setExpiryTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(15 * 60);
  const [progress, setProgress] = useState<number>(100);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiry = getTokenExpiryTime(token);

    if (expiry) {
      setExpiryTime(expiry);
      setTotalTime(900);
    }
  }, []);

  useEffect(() => {
    if (!expiryTime) return;

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = expiryTime - now;

      if (remaining <= 0) {
        setTimeLeft(0);
        setProgress(0);
        clearInterval(interval);
        toast.error("Session expired", {
          description: "Please log in again",
        });
        setTimeout(() => {
          localStorage.removeItem("token");
          window.location.reload();
        }, 2000);
      } else {
        setTimeLeft(remaining);
        const progressPercent = (remaining / totalTime) * 100;
        setProgress(Math.max(0, Math.min(100, progressPercent)));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime, totalTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getColorClass = (): string => {
    if (progress > 50) return "bg-green-500";
    if (progress > 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex flex-col items-center space-y-2 mb-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-gray-500" />
        <span className="font-medium">Session expires in:</span>
        <span
          className={`font-bold ${
            timeLeft < 60
              ? "text-red-500"
              : timeLeft < 300
              ? "text-yellow-500"
              : "text-green-500"
          }`}
        >
          {formatTime(timeLeft)}
        </span>
      </div>
      <Progress value={progress} className={`w-full h-2 ${getColorClass()}`} />
    </div>
  );
}

export default function NoteTakingApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const login = async () => {
    try {
      setLoginLoading(true);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
      toast.success("Login successful");
      fetchNotes();
    } catch (error) {
      toast.error("Login failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setNotes([]);
    toast.info("Logged out successfully");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      fetchNotes();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("/api/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          logout();
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error("Failed to fetch notes");
      }

      const data = await response.json();
      setNotes(data);
    } catch (error) {
      toast.error("Error fetching notes", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Information missing", {
        description: "Please add a title for your note and description",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Create new note
      const response = await fetch("/api/notes", {
        method: "POST",
        headers,
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      toast.success("Note added");

      // Refresh notes after add
      fetchNotes();
      setTitle("");
      setContent("");
    } catch (error) {
      toast.error("Error adding note", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      toast.success("Note deleted");
      fetchNotes();
    } catch (error) {
      toast.error("Error deleting note", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return formatter.format(new Date(dateString));
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-20 px-4 flex justify-center">
        <Toaster position="bottom-right" />
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Access your secure notes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={login} disabled={loginLoading}>
              {loginLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <Button variant="outline" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* JWT Expiry Timer Component */}
      <JWTExpiryTimer />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Note</CardTitle>
            <CardDescription>
              Create a new note to save your thoughts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Write your note here..."
                className="min-h-[150px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button className="ml-auto" onClick={handleAddNote}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Your Notes</h2>
          {isLoading ? (
            <div className="text-center py-10 text-muted-foreground">
              Loading notes...
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No notes yet. Create your first note!
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
              {notes.map((note) => (
                <Card key={note.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <CardDescription>
                      {formatDate(note.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{note.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(note.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-800" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
