// Backend API endpoint
// export const apiEndpoint = 'http://localhost:3003/dev'
const apiId = 'uj7di6b9af'
export const apiEndpoint = `https://${apiId}.execute-api.ap-southeast-1.amazonaws.com/dev`

// Auth0 configuration
export const authConfig = {
  domain: 'xssssl.au.auth0.com',            // Auth0 domain
  clientId: 'Tp1iFsZoEnAFGzrdyJ1IvCkgDK9gSLHQ',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
