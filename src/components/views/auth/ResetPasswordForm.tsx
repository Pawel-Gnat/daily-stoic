import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/shared/Button";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/form/TextField";
import { toast } from "sonner";
import { useNavigate } from "@/hooks/useNavigate";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/schemas/auth.schema";
import { supabaseClient } from "@/db/supabase.client";

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmNewPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const { error } = await supabaseClient.auth.updateUser({
        password: data.newPassword,
      });
      if (error) throw error;
      navigate("/login?reset_success=true");
    } catch (error: unknown) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to reset password.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TextField
          control={form.control}
          name="newPassword"
          label="New Password"
          placeholder="Enter your new password"
          type="password"
        />
        <TextField
          control={form.control}
          name="confirmNewPassword"
          label="Confirm New Password"
          placeholder="Confirm your new password"
          type="password"
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Resetting..." : "Reset Password"}
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
