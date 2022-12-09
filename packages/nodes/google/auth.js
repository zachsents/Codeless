

export async function authorizeGoogleAPIs(authError) {
    // grab stored refresh token
    const appSnapshot = await global.admin.firestore().doc(`apps/${global.info.appId}`).get()
    const refreshToken = appSnapshot.data().integrations?.Google?.refreshToken

    // throw error if there's no token
    if (!refreshToken)
        throw authError

    // authorize OAuth2 client with stored token
    global.oauthClient.setCredentials({
        refresh_token: refreshToken,
    })

    // return OAuth2 client for convenience
    return global.oauthClient
}