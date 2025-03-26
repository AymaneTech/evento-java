import type React from "react"
import { Route } from "react-router-dom"

interface DirectRouteProps {
  path: string
  element: React.ReactElement
}

/**
 * A route component that bypasses all middleware and protection
 * Use this for routes that should always be accessible like login and register
 */
export const DirectRoute: React.FC<DirectRouteProps> = ({ path, element }) => {
  return <Route path={path} element={element} />
}


