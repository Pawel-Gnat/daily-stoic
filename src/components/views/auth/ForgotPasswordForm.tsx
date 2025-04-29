import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/shared/Button";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/form/TextField";
import { toast } from "sonner";
import { useNavigate } from "@/hooks/useNavigate";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/schemas/auth.schema";

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: data.email }),
      });
      const payload = await res.json();

      if (!res.ok) throw new Error(payload.error);
      navigate("/login?forgot_sent=true");
    } catch (error: unknown) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "An error occurred during login.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TextField control={form.control} name="email" label="Email" placeholder="Enter your email" />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Sending..." : "Send reset link"}
        </Button>
        <div className="text-center text-sm">
          <a href="/login" className="text-primary hover:underline">
            Back to login
          </a>
        </div>
      </form>
    </Form>
  );
}
