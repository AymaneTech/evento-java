import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button.tsx"
import { ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Unauthorized Access</h1>
        <p className="mt-6 text-base leading-7 text-gray-600">You don't have permission to access this page.</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go back
          </Button>
        </div>
      </div>
    </div>
  )
}


