import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuthStore } from "../../store/auth.store"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type PasswordFormValues = z.infer<typeof passwordSchema>

export default function ChangePassword() {
  const { changePassword, isLoading } = useAuthStore()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: PasswordFormValues) => {
    try {
      setSuccess(false)
      setError(null)

      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      })

      setSuccess(true)
      form.reset()

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError("Failed to change password. Please check your current password and try again.")
    }
  }

  return (
    <div>
      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">Password changed successfully!</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
          <button className="ml-auto text-sm underline" onClick={() => setError(null)}>
            Dismiss
          </button>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Changing Password...
              </>
            ) : (
              "Change Password"
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-sm text-muted-foreground">
        <p>Password requirements:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>At least 8 characters long</li>
          <li>Include both uppercase and lowercase letters</li>
          <li>Include at least one number</li>
          <li>Include at least one special character</li>
        </ul>
      </div>
    </div>
  )
}


