
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuthStore } from "../../store/auth.store"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { debugAuthState } from "../../lib/debug.util"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { login, isLoading, parsedError, clearError } = useAuthStore()

  // Debug auth state on component mount
  debugAuthState("Login page mount")

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setErrorMessage(null)
      clearError()

      console.log("Submitting login form with:", values.email)
      const redirectPath = await login(values)

      console.log("Login successful, redirecting to:", redirectPath)
      // Use the from location if available (user was redirected to login)
      const from = location.state?.from?.pathname || redirectPath

      // Debug auth state before navigation
      debugAuthState("Before navigation after login")

      // Navigate to the redirect path
      navigate(from, { replace: true })
    } catch (error) {
      console.error("Login error in component:", error)
      setErrorMessage("Authentication failed. Please check your credentials and try again.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Sign in to your account</CardTitle>
          <CardDescription>Enter your email and password to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          {(errorMessage || parsedError) && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage || parsedError}</AlertDescription>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 ml-auto"
                onClick={() => {
                  setErrorMessage(null)
                  clearError()
                }}
              >
                ×
              </Button>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" autoComplete="email" placeholder="name@example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Button
                        variant="link"
                        className="px-0 font-normal"
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <FormControl>
                      <Input {...field} type="password" autoComplete="current-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Button variant="link" className="px-0" onClick={() => navigate("/register")}>
              Sign up
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}


