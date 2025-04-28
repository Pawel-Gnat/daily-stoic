import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@/hooks/useNavigate";
import { loginSchema, type LoginFormData } from "@/lib/schemas/auth.schema";
import type { LoginUserDto } from "@/types";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { TextField } from "@/components/form/TextField";

export function LoginForm() {
  const { login } = useAuth();
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
      const loginData: LoginUserDto = {
        email: data.email,
        password: data.password,
      };
      await login(loginData);
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during login.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TextField control={form.control} name="email" label="Email" placeholder="Enter your email" />
        <TextField control={form.control} name="password" label="Password" placeholder="Enter your password" />

        <Button type="submit" className="w-full bg-golden" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Logging in..." : "Log in"}
        </Button>

        <div className="text-center text-sm">
          <a href="/register" className="text-primary hover:underline">
            Don&apos;t have an account? Sign up
          </a>
        </div>
      </form>
    </Form>
  );
}
