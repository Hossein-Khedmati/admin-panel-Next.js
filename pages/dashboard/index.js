import DashboardPage from "../../components/DashboardPage"
import ProtectedRoute from "../../features/ProtectedRoute"

export default function Home() {
  return (
    <div>
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
     
    </div>
  )
}
