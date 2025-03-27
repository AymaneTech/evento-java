import { BrowserRouter as Router } from "react-router-dom"
import { Routes } from "./routes/Routes"
import { Toaster } from "./components/ui/sonner"
import { AuthMiddleware } from "./components/AuthMiddleware"
import { useEffect } from "react"
import { debugAuthState } from "./lib/debug.util"

function App() {
  useEffect(() => {
    debugAuthState("App mount")
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <AuthMiddleware>
          <Routes />
        </AuthMiddleware>
        <Toaster />
      </div>
    </Router>
  )
}

export default App


