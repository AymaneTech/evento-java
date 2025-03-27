import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/auth.store"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Alert, AlertDescription } from "../../components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog"
import { Loader2, AlertCircle } from "lucide-react"

export default function DeleteAccount() {
  const navigate = useNavigate()
  const { deleteAccount, isLoading, user } = useAuthStore()
  const [confirmText, setConfirmText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const expectedConfirmation = user?.email || ""
  const isConfirmationValid = confirmText === expectedConfirmation

  const handleDeleteAccount = async () => {
    try {
      setError(null)
      await deleteAccount()
      navigate("/")
    } catch (err) {
      setError("Failed to delete account. Please try again.")
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
          <button className="ml-auto text-sm underline" onClick={() => setError(null)}>
            Dismiss
          </button>
        </Alert>
      )}

      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
        <h3 className="font-medium mb-2">Warning: This action cannot be undone</h3>
        <p className="text-sm">
          Deleting your account will permanently remove all your data from our system, including:
        </p>
        <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
          <li>Your profile information</li>
          <li>Your event history</li>
          <li>Your bookings and reservations</li>
          <li>Any content you've created</li>
        </ul>
      </div>

      <div className="space-y-4">
        <p className="text-sm">
          To confirm deletion, please type your email address: <strong>{expectedConfirmation}</strong>
        </p>
        <Input
          type="text"
          placeholder="Enter your email address"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
        />
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={!isConfirmationValid || isLoading}>
            Delete My Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Your account will be permanently deleted and all your data will be removed
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes, Delete My Account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


