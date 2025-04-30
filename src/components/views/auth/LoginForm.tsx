import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/shared/Button";
import { useNavigate } from "@/hooks/useNavigate";
import { loginSchema, type LoginFormData } from "@/lib/schemas/auth.schema";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { TextField } from "@/components/form/TextField";

export function LoginForm() {
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const payload = await res.json();

      if (!res.ok) throw new Error(payload.error);
      navigate("/");
    } catch (error: unknown) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "An error occurred during login.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TextField control={form.control} name="email" label="Email" placeholder="Enter your email" />
        <TextField
          type="password"
          control={form.control}
          name="password"
          label="Password"
          placeholder="Enter your password"
        />

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Logging in..." : "Log in"}
        </Button>

        <div className="text-center text-sm flex flex-col gap-2">
          <a href="/register" className="text-primary hover:underline">
            Don&apos;t have an account? Sign up
          </a>
          <a href="/forgot-password" className="text-primary hover:underline">
            Forgot your password?
          </a>
        </div>
      </form>
    </Form>
  );
}
