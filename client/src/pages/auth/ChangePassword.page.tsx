import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApiMutation } from "../../api/hooks.ts"
import { Button } from "../../components/ui/button.tsx"
import { Input } from "../../components/ui/input.tsx"
import { Label } from "../../components/ui/label.tsx"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card.tsx"
import { Alert, AlertDescription } from "../../components/ui/alert.tsx"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import type { ChangePasswordRequestDto } from "../../types/auth.types.ts"

export default function ChangePasswordPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState("")
  const [success, setSuccess] = useState(false)

  const { mutate, loading, error } = useApiMutation<void, ChangePasswordRequestDto>("/auth/change-password", {
    onSuccess: () => {
      setSuccess(true)
      setTimeout(() => {
        navigate("/dashboard")
      }, 2000)
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (passwordError) setPasswordError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Change password form submitted, default prevented")

    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    try {
      await mutate({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      })
    } catch (err) {
      console.error("Password change error:", err)
      // Error is handled by the hook
    }
  }

  // Extract error message from AxiosError or Error
  const errorMessage = error
    ? (error as any).response?.data?.message || error.message || "Password change failed"
    : null

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
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
          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>Password changed successfully! Redirecting...</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Current Password</Label>
              <Input
                id="oldPassword"
                name="oldPassword"
                type="password"
                required
                value={formData.oldPassword}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || success}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating password...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" onClick={() => navigate("/dashboard")} disabled={loading}>
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => console.log("Form data:", formData, "Error:", error, "Success:", success)}
            variant="outline"
            size="sm"
          >
            Debug
          </Button>
        </div>
      )}
    </div>
  )
}


