import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Label from "../ui/Label";
import { Link } from "react-router";
import { Video } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login form submitted", form);
  };

  return (
    <>
      <nav className="w-full px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Video className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">MeetNow</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-4xl font-bold text-center  text-blue-600 dark:text-blue-400 mb-6">Login</h2>
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Log in to your MeetNow account to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="mt-2"
              />
            </div>

            <Button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700">
              Log In
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
