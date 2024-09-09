export const GRAPHQL_API_URL = `${window.location.origin}/graphql`;
export const AUTH_API_URL = `${window.location.origin}/api/auth`;
export const GRAPHQL_WS_URL = `ws://${process.env.NODE_ENV === 'development' ? 'localhost:3000' : window.location.host}/graphql`;
