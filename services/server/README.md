# Google oauth 2.0

## Get google oauth creds

- <https://console.cloud.google.com/>
- Credentials -> Create credentials -> OAuth client ID
- Configure consent screen
  - User type : external
  - App name, user support email,Authorised domains (not needed for localhost), dev contact info
  - Scopes : userinfo.email, userinfo.phone, openid
  - Add test users
- Application type: web app
- Authorized redirect URIs : <http://localhost:5001/api/v1/auth/google/callback>
