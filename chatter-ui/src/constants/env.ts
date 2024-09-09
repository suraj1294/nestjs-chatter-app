export const GRAPHQL_API_URL = `${window.location.origin}/graphql`;
export const AUTH_API_URL = `${window.location.origin}/api/auth`;
export const GRAPHQL_WS_URL = `${process.env.NODE_ENV === 'development' ? 'ws://localhost:3000' : 'wss://' + window.location.host}/graphql`;
