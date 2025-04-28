import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabaseClient } from "@/db/supabase.client";
import type { AuthResponseDto, LoginUserDto, RegisterUserDto, UserDto } from "@/types";

export function useAuth() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name,
          created_at: session.user.created_at,
        });
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name,
          created_at: session.user.created_at,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async ({ email, password }: LoginUserDto) => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const authResponse: AuthResponseDto = {
        token: data.session?.access_token ?? "",
        user: {
          id: data.user!.id,
          email: data.user!.email!,
          name: data.user!.user_metadata.name,
          created_at: data.user!.created_at,
        },
      };

      toast.success("Successfully logged in!");
      return authResponse;
    } catch (error) {
      toast.error("Failed to log in. Please check your credentials.");
      throw error;
    }
  };

  const register = async ({ email, password, name }: RegisterUserDto) => {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      const authResponse: AuthResponseDto = {
        token: data.session?.access_token ?? "",
        user: {
          id: data.user!.id,
          email: data.user!.email!,
          name: data.user!.user_metadata.name,
          created_at: data.user!.created_at,
        },
      };

      toast.success("Registration successful! Please check your email to verify your account.");
      return authResponse;
    } catch (error) {
      toast.error("Failed to register. Please try again.");
      throw error;
    }
  };

  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }
      // Clear client-side session
      setUser(null);
      toast.success("Successfully logged out!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to log out.");
      throw error;
    }
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
  };
}
