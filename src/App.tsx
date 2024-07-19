import { createRouter, RouterProvider } from '@tanstack/react-router'

import './globals.css'
import { routeTree } from './route-tree.gen'

const router = createRouter({
  routeTree,
})

export function App() {
  return <RouterProvider router={router} />
}
