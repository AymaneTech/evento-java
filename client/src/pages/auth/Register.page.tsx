import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiMutation } from "../../api/hooks.ts";
import { Button } from "../../components/ui/button.tsx";
import { Input } from "../../components/ui/input.tsx";
import { Label } from "../../components/ui/label.tsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card.tsx";
import { Alert, AlertDescription } from "../../components/ui/alert.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select.tsx";
import { Loader2, AlertCircle } from 'lucide-react';
import { RegisterNewUserRequestDto, UserResponseDto, UserLoginRequestDto, AuthenticationResponseDto } from "../../types/auth.types.ts";
import { setAuthTokens } from "../../api/axios.ts";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleId: 2, // Default to user role
  });
  const [passwordError, setPasswordError] = useState("");

  // Register mutation
  const {
    mutate: registerMutate,
    loading: registerLoading,
    error: registerError
  } = useApiMutation<UserResponseDto, RegisterNewUserRequestDto>(
    '/auth/register',
    {
      onSuccess: async (data) => {
        console.log("Registration successful, proceeding to login");
        // After successful registration, login automatically
        await loginMutate({
          email: formData.email,
          password: formData.password
        });
      }
    }
  );

  // Login mutation (used after registration)
  const {
    mutate: loginMutate,
    loading: loginLoading,
    error: loginError
  } = useApiMutation<AuthenticationResponseDto, UserLoginRequestDto>(
    '/auth/login',
    {
      onSuccess: (data) => {
        // Store tokens
        setAuthTokens(data.token, data.refreshToken);
        // Navigate to dashboard
        navigate("/dashboard");
      }
    }
  );

  const isLoading = registerLoading || loginLoading;
  const error = registerError || loginError;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (passwordError) setPasswordError("");
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, roleId: Number.parseInt(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register form submitted, default prevented");

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      await registerMutate({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        roleId: formData.roleId,
      });
    } catch (err) {
      console.error("Registration error:", err);
      // Error is handled by the hook
    }
  };

  // Extract error message from AxiosError or Error
  const errorMessage = error ?
    (error as any).response?.data?.message || error.message || "Registration failed"
    : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          {passwordError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{passwordError}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" required value={formData.firstName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" required value={formData.lastName} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={handleRoleChange} defaultValue={formData.roleId.toString()}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Admin</SelectItem>
                  <SelectItem value="2">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {registerLoading ? "Creating account..." : "Signing in..."}
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Button variant="link" className="px-0" onClick={() => navigate("/login")}>
              Sign in
            </Button>
          </p>
        </CardFooter>
      </Card>
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => console.log("Form data:", formData, "Error:", error)}
            variant="outline"
            size="sm"
          >
            Debug
          </Button>
        </div>
      )}
    </div>
  );
}

