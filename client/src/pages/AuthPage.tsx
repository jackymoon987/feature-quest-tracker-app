import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "../hooks/use-user";
import { insertUserSchema } from "@db/schema";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, register } = useUser();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = insertUserSchema.safeParse({ username, password });
    if (!validation.success) {
      return toast({
        title: "Invalid input",
        description: validation.error.issues.map(i => i.message).join(", "),
        variant: "destructive"
      });
    }

    try {
      const result = await (isLogin ? login : register)({ username, password });
      if (!result.ok) {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-8">
          {isLogin ? "Login" : "Register"}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            {isLogin ? "Login" : "Register"}
          </Button>
        </form>

        <p className="text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-primary underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </Card>
    </div>
  );
}
