import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/form/TextField";
import { toast } from "sonner";
import { useNavigate } from "@/hooks/useNavigate";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/schemas/auth.schema";
import { supabaseClient } from "@/db/supabase.client";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const navigate = useNavigate();
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmNewPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      // Optionally set session from token if required: supabaseClient.auth.setSession({ access_token: token });
      const { data: res, error } = await supabaseClient.auth.updateUser({
        password: data.newPassword,
      });
      if (error) throw error;
      toast.success("Password has been reset successfully.");
      navigate("/login?reset_success=true");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message ?? "Failed to reset password.");
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
        <Button type="submit" className="w-full bg-golden" disabled={form.formState.isSubmitting}>
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
