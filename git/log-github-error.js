'use strict'

// Logs a clear, actionable message for a failed GitHub API request. The caller
// is still responsible for rethrowing the original error.
//
// We intentionally do NOT log the raw axios error object: it carries the
// request config including the Authorization header, i.e. it would leak the
// --gh-token into the output.
module.exports = function logGithubError(error, {context, owner, repo}) {
  const status = error.response?.status
  const data = error.response?.data

  console.error(`${context} failed: ${error.message}`)
  if (data) console.error(data)

  if (status === 401) {
    console.error('Hint: 401 Unauthorized - the --gh-token is missing, malformed or expired.')
  } else if (status === 403) {
    console.error('Hint: 403 Forbidden - the --gh-token lacks scope, or a rate limit was hit.')
  } else if (status === 404) {
    console.error(
      `Hint: 404 Not Found for "${owner}/${repo}". Either the repository does not exist, or the ` +
        '--gh-token cannot access it. GitHub returns 404 (not 403) for private repos a token ' +
        'cannot see, so check --owner/--repo and that the token has access to that repository.'
    )
  }
}
