"use client";

import { useState } from "react";
import type React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function LandingPage() {
  const [open, setOpen] = useState(false);

  const handleSignupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Signup form submitted");
  };

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login form submitted");
    setOpen(false); // Close the dialog after form submission
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-500" />
          <span className="font-bold text-xl">NoteStack</span>
        </div>

        <div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="mr-2 font-medium">
                Log in
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  Login to your account
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Enter your email below to login to your account
                </DialogDescription>
              </DialogHeader>
              <LoginForm onSubmit={handleLoginSubmit} />
            </DialogContent>
          </Dialog>
        </div>
      </nav>

      {/* Hero Section */}
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
            <div className="pt-2">
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white">
                Learn more
              </Button>
            </div>
          </div>

          {/* Signup Form Card */}
          <Card className="shadow-lg border-0 dark:bg-gray-900 mx-auto w-full max-w-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">
                Sign Up to Join NoteStack
              </CardTitle>
              <CardDescription>
                Create your account to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSignupSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LabelInputContainer>
                    <Label htmlFor="firstname" className="font-medium">
                      First name
                    </Label>
                    <Input
                      id="firstname"
                      placeholder="Tyler"
                      type="text"
                      className="border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="lastname" className="font-medium">
                      Last name
                    </Label>
                    <Input
                      id="lastname"
                      placeholder="Durden"
                      type="text"
                      className="border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </LabelInputContainer>
                </div>
                <LabelInputContainer>
                  <Label htmlFor="email" className="font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    placeholder="projectmayhem@fc.com"
                    type="email"
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
                    className="border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </LabelInputContainer>

                <button
                  className="group/btn relative block h-12 w-full rounded-md bg-gradient-to-br from-blue-600 to-blue-800 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:from-blue-700 dark:to-blue-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] transition-all duration-300 hover:shadow-blue-500/20 hover:shadow-lg"
                  type="submit"
                >
                  <span className="relative z-10">Sign up &rarr;</span>
                </button>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
                  By signing up, you agree to our{" "}
                  <a
                    href="#"
                    className="text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Privacy Policy
                  </a>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function LoginForm({
  onSubmit,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="login-email" className="font-medium">
              Email
            </Label>
            <Input
              id="login-email"
              type="email"
              placeholder="m@example.com"
              required
              className="border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="login-password" className="font-medium">
                Password
              </Label>
              <a
                href="#"
                className="ml-auto inline-block text-sm text-blue-600 dark:text-blue-500 hover:underline underline-offset-4"
              >
                Forgot your password?
              </a>
            </div>
            <Input
              id="login-password"
              type="password"
              required
              className="border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white h-11"
            >
              Login
            </Button>
          </div>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <a
            href="./"
            className="text-blue-600 dark:text-blue-500 hover:underline underline-offset-4"
          >
            Sign up
          </a>
        </div>
      </form>
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
