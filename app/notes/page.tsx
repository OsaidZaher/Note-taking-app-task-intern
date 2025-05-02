"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Trash2, LogOut } from "lucide-react";
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
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
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

  // Authentication functions
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

  // Check token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      fetchNotes();
    } else {
      setIsLoading(false);
    }
  }, []);

  // API functions
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
    if (!title.trim()) {
      toast.error("Title required", {
        description: "Please add a title for your note",
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

  // No edit functionality

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <Button variant="outline" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

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
                      <Trash2 className="h-4 w-4" />
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
