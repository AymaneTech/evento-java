import { BrowserRouter as Router } from 'react-router-dom';
import { Routes } from "./routes/Routes";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
