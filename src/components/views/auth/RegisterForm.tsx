import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@/hooks/useNavigate";
import { registerSchema, type RegisterFormData } from "@/lib/schemas/auth.schema";
import type { RegisterUserDto } from "@/types";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/form/TextField";

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const registerData: RegisterUserDto = {
        email: data.email,
        password: data.password,
        name: data.name,
      };
      await registerUser(registerData);
      navigate("/login?registered=true");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during registration.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TextField control={form.control} name="name" label="Name" placeholder="Enter your name" />
        <TextField control={form.control} name="email" label="Email" placeholder="Enter your email" />
        <TextField control={form.control} name="password" label="Password" placeholder="Enter your password" />
        <TextField
          control={form.control}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
        />

        <Button type="submit" className="w-full bg-golden" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating account..." : "Create account"}
        </Button>

        <div className="text-center text-sm">
          <a href="/login" className="text-primary hover:underline">
            Already have an account? Sign in
          </a>
        </div>
      </form>
    </Form>
  );
}
