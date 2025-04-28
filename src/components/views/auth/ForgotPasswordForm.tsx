import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/form/TextField";
import { toast } from "sonner";
import { useNavigate } from "@/hooks/useNavigate";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/schemas/auth.schema";
import { supabaseClient } from "@/db/supabase.client";

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const { data: res, error } = await supabaseClient.auth.resetPasswordForEmail(data.email, {
        redirectTo: window.location.origin + "/reset-password",
      });
      if (error) throw error;
      toast.success("Password reset email sent. Please check your inbox.");
      navigate("/login?forgot_sent=true");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message ?? "Failed to send reset email.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TextField control={form.control} name="email" label="Email" placeholder="Enter your email" />
        <Button type="submit" className="w-full bg-golden" disabled={form.formState.isSubmitting}>
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
