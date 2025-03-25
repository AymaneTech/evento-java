import { useEffect, useState } from "react"
import { useAuthStore } from "../../store/auth.store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Loader2, AlertCircle, User, Lock, LogOut } from "lucide-react"
import ProfileDetails from "./profile-details.page"
import ChangePassword from "./change-password.page"
import DeleteAccount from "./delete-account.page"

export default function ProfilePage() {
  const { user, isLoading, error, fetchCurrentUser, clearError } = useAuthStore()
  const [activeTab, setActiveTab] = useState("details")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        await fetchCurrentUser()
      } catch (error) {
        console.error("Failed to load user profile:", error)
        setErrorMessage("Failed to load your profile. Please try again.")
      }
    }

    loadUserProfile()
  }, [fetchCurrentUser])


  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        {(errorMessage || error) && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage || error}</AlertDescription>
            <button
              className="ml-auto text-sm underline"
              onClick={() => {
                setErrorMessage(null)
                clearError()
              }}
            >
              Dismiss
            </button>
          </Alert>
        )}

        {isLoading && !user ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile Details</span>
              </TabsTrigger>
              <TabsTrigger value="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Change Password</span>
              </TabsTrigger>
              <TabsTrigger value="delete" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Delete Account</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>View and update your personal information</CardDescription>
                </CardHeader>
                <CardContent>{user && <ProfileDetails user={user} />}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChangePassword />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="delete">
              <Card>
                <CardHeader>
                  <CardTitle>Delete Account</CardTitle>
                  <CardDescription>Permanently delete your account and all associated data</CardDescription>
                </CardHeader>
                <CardContent>
                  <DeleteAccount />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}


