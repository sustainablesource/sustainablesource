import { Users } from '@sustainablesource/user-registry'
import { getGist } from '@sustainablesource/github-api'

export default async function (request, response) {
  try {
    await attest(request)
  } catch (error) {
    response.statusCode = error.statusCode || 500
  }
  response.end()
}

const attest = async (request) => {
  const requestId = extractRequestId(request)
  const accessToken = extractAccessToken(request)
  const { gistId, account } = await retrieveRequest({ id: requestId })
  const { isCorrect, username } =
    await checkGist({ id: gistId, account, accessToken })
  await respond({ requestId, isCorrect, username })
}

const extractRequestId = request => {
  const url = new URL(request.url, `http://${request.headers.host}`)
  const requestId = url.searchParams.get('requestId')
  if (!requestId) {
    throw new ValidationError(400)
  }
  return requestId
}

const extractAccessToken = request => {
  const { authorization } = request.headers
  if (!authorization) {
    throw new ValidationError(403)
  }
  const parsed = authorization.match(/^token (.*)$/)
  if (!parsed) {
    throw new ValidationError(400)
  }
  return parsed[1]
}

const retrieveRequest = async ({ id }) => {
  const users = await Users.deployed()
  try {
    const [gistId, account] = await users.oracleRequest(id)
    if (gistId === '') {
      throw new ValidationError(404)
    }
    return { gistId, account }
  } catch (error) {
    throw new ValidationError(404)
  }
}

class ValidationError extends Error {
  constructor (statusCode) {
    super(`validation failed with error code ${statusCode}`)
    this.statusCode = statusCode
  }
}

const checkGist = async ({ id, account, accessToken }) => {
  try {
    const gist = await getGist({ id, accessToken })
    if (gist.files.attestation && gist.files.attestation.contents === account) {
      return { isCorrect: true, username: gist.owner.login }
    }
  } catch (error) { }
  return { isCorrect: false, username: '' }
}

const respond = async ({ requestId, isCorrect, username }) => {
  const users = await Users.deployed()
  await users.oracleResponse(requestId, isCorrect, username)
}
