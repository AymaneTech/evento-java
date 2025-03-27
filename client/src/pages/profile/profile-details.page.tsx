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
import type { UserResponseDto } from "../../types/auth.types"

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileDetailsProps {
  user: UserResponseDto
}

export default function ProfileDetails({ user }: ProfileDetailsProps) {
  const { updateProfile, isLoading } = useAuthStore()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  })

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setSuccess(false)
      setError(null)
      await updateProfile(values)
      setSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError("Failed to update profile. Please try again.")
    }
  }

  return (
    <div>
      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">Profile updated successfully!</AlertDescription>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-8 pt-6 border-t">
        <h3 className="text-lg font-medium mb-2">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Role</p>
            <p className="font-medium">{user.role.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Member Since</p>
            <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}


