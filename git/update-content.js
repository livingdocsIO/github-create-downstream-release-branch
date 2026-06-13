'use strict'

const axios = require('axios')
const logGithubError = require('./log-github-error')

// https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#create-or-update-file-contents
//
// @return
module.exports = async ({owner, repo, token, path, message, content, sha, branch}) => {
  try {
    const {data} = await axios.put(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {message, content, sha, branch},
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `token ${token}`,
          'User-Agent': 'Axios',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    )
    return data
  } catch (error) {
    logGithubError(error, {
      context: 'github-create-downstream-release-branch.update-content',
      owner,
      repo
    })
    throw error
  }
}
