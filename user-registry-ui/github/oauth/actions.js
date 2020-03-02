import { createAction } from '@reduxjs/toolkit'

export const storeOAuthToken = createAction('github/oauth/token/store')
export const clearOAuthToken = createAction('github/oauth/token/clear')
