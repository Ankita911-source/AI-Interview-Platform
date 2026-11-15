import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, PublicOnlyRoute } from "./components/RouteGuards";
import AppLayout from "./components/AppLayout";
import AuthPage from "./pages/authPage";
import InterviewPage from "./pages/interviewPage";
import HistoryPage from "./pages/historyPage";
import ReportPage from "./pages/reportPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<AuthPage mode="login" />} />
              <Route path="/signup" element={<AuthPage mode="signup" />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<InterviewPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/history/:sessionId" element={<ReportPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
