import Dashboard from '@/components/Dashboard';
import { DashboardRoute } from '@/components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <DashboardRoute>
      <Dashboard />
    </DashboardRoute>
  );
} 