'use strict'

const axios = require('axios')
const logGithubError = require('./log-github-error')

// https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#create-a-reference
module.exports = async ({owner, repo, token, ref, sha, debug}) => {
  try {
    const {data} = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/git/refs`,
      {ref, sha},
      {
        headers: {
          Authorization: `token ${token}`,
          'User-Agent': 'Axios',
          Accept: 'application/vnd.github.groot-preview+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    )
    if (debug) {
      console.log('github-create-downstream-release-branch.create-branch()', data)
    }
    return {sha: data.object.sha}
  } catch (error) {
    logGithubError(error, {
      context: 'github-create-downstream-release-branch.create-branch',
      owner,
      repo
    })
    if (error?.response?.status === 422) {
      console.error(
        `Hint: You need to check "Do not require status checks on creation" for a release branch on the GitHub branch protection rules.`
      )
    }
    throw error
  }
}
