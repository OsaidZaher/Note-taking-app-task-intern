"use client";

import { useState } from "react";
import type React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

import { toast, Toaster } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LandingPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      toast.success("user has logged in");

      router.push("/notes");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black">
      <Toaster position="bottom-right" />

      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-500" />
          <span className="font-bold text-xl">NoteStack</span>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Your Ultimate Notetaking App for{" "}
              <span className="text-blue-600 dark:text-blue-500">
                Exam Success
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Organize your study materials, collaborate with classmates, and
              ace your exams with NoteStack's powerful features.
            </p>
            <div className="pt-2"></div>
          </div>

          <Card className="shadow-lg border-0 dark:bg-gray-900 mx-auto w-full max-w-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">
                LogIn to your single user account
              </CardTitle>
              <CardDescription>
                Only one single hardcoded user can log in as required in part 1.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                <LabelInputContainer>
                  <Label htmlFor="username" className="font-medium">
                    Username
                  </Label>
                  <Input
                    id="username"
                    placeholder="intern :)"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="password" className="font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </LabelInputContainer>

                <button
                  className="group/btn relative block h-12 w-full rounded-md bg-gradient-to-br from-blue-600 to-blue-800 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:from-blue-700 dark:to-blue-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] transition-all duration-300 hover:shadow-blue-500/20 hover:shadow-lg"
                  type="submit"
                >
                  <span className="relative z-10">Log In &rarr;</span>
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
