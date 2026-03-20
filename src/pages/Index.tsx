import { Navigate } from 'react-router-dom'
import { useAppStore } from '@/stores/main'

const Index = () => {
  const { activeTenant } = useAppStore()

  if (activeTenant) {
    return <Navigate to={`/${activeTenant.id}/clause/4.1`} replace />
  }

  return <Navigate to="/tenants" replace />
}

export default Index
