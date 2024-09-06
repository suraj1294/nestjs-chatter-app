/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as ChatChatImport } from './routes/chat/_chat'
import { Route as AuthAuthImport } from './routes/auth/_auth'

// Create Virtual Routes

const ChatImport = createFileRoute('/chat')()
const AuthImport = createFileRoute('/auth')()
const ChatChatIndexLazyImport = createFileRoute('/chat/_chat/')()
const ChatChatIdLazyImport = createFileRoute('/chat/_chat/$id')()
const AuthAuthSignUpLazyImport = createFileRoute('/auth/_auth/sign-up')()
const AuthAuthLoginLazyImport = createFileRoute('/auth/_auth/login')()

// Create/Update Routes

const ChatRoute = ChatImport.update({
  path: '/chat',
  getParentRoute: () => rootRoute,
} as any)

const AuthRoute = AuthImport.update({
  path: '/auth',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const ChatChatRoute = ChatChatImport.update({
  id: '/_chat',
  getParentRoute: () => ChatRoute,
} as any)

const AuthAuthRoute = AuthAuthImport.update({
  id: '/_auth',
  getParentRoute: () => AuthRoute,
} as any)

const ChatChatIndexLazyRoute = ChatChatIndexLazyImport.update({
  path: '/',
  getParentRoute: () => ChatChatRoute,
} as any).lazy(() =>
  import('./routes/chat/_chat/index.lazy').then((d) => d.Route),
)

const ChatChatIdLazyRoute = ChatChatIdLazyImport.update({
  path: '/$id',
  getParentRoute: () => ChatChatRoute,
} as any).lazy(() =>
  import('./routes/chat/_chat/$id.lazy').then((d) => d.Route),
)

const AuthAuthSignUpLazyRoute = AuthAuthSignUpLazyImport.update({
  path: '/sign-up',
  getParentRoute: () => AuthAuthRoute,
} as any).lazy(() =>
  import('./routes/auth/_auth/sign-up.lazy').then((d) => d.Route),
)

const AuthAuthLoginLazyRoute = AuthAuthLoginLazyImport.update({
  path: '/login',
  getParentRoute: () => AuthAuthRoute,
} as any).lazy(() =>
  import('./routes/auth/_auth/login.lazy').then((d) => d.Route),
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/auth': {
      id: '/auth'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/auth/_auth': {
      id: '/auth/_auth'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof AuthAuthImport
      parentRoute: typeof AuthRoute
    }
    '/chat': {
      id: '/chat'
      path: '/chat'
      fullPath: '/chat'
      preLoaderRoute: typeof ChatImport
      parentRoute: typeof rootRoute
    }
    '/chat/_chat': {
      id: '/chat/_chat'
      path: '/chat'
      fullPath: '/chat'
      preLoaderRoute: typeof ChatChatImport
      parentRoute: typeof ChatRoute
    }
    '/auth/_auth/login': {
      id: '/auth/_auth/login'
      path: '/login'
      fullPath: '/auth/login'
      preLoaderRoute: typeof AuthAuthLoginLazyImport
      parentRoute: typeof AuthAuthImport
    }
    '/auth/_auth/sign-up': {
      id: '/auth/_auth/sign-up'
      path: '/sign-up'
      fullPath: '/auth/sign-up'
      preLoaderRoute: typeof AuthAuthSignUpLazyImport
      parentRoute: typeof AuthAuthImport
    }
    '/chat/_chat/$id': {
      id: '/chat/_chat/$id'
      path: '/$id'
      fullPath: '/chat/$id'
      preLoaderRoute: typeof ChatChatIdLazyImport
      parentRoute: typeof ChatChatImport
    }
    '/chat/_chat/': {
      id: '/chat/_chat/'
      path: '/'
      fullPath: '/chat/'
      preLoaderRoute: typeof ChatChatIndexLazyImport
      parentRoute: typeof ChatChatImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  AuthRoute: AuthRoute.addChildren({
    AuthAuthRoute: AuthAuthRoute.addChildren({
      AuthAuthLoginLazyRoute,
      AuthAuthSignUpLazyRoute,
    }),
  }),
  ChatRoute: ChatRoute.addChildren({
    ChatChatRoute: ChatChatRoute.addChildren({
      ChatChatIdLazyRoute,
      ChatChatIndexLazyRoute,
    }),
  }),
})

/* prettier-ignore-end */
