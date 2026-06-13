'use strict'

const axios = require('axios')
const logGithubError = require('./log-github-error')

// https://docs.github.com/en/rest/reference/repos#list-repository-tags
// https://api.github.com/repos/livingdocsio/livingdocs-server/tags?access_token=1234
//
// @return
// [
//   {
//     "name": "v0.1",
//     "commit": {
//       "sha": "c5b97d5ae6c19d5c5df71a34c7fbeeda2479ccbc",
//       "url": "https://api.github.com/repos/octocat/Hello-World/commits/c5b97d5ae6c19d5c5df71a34c7fbeeda2479ccbc"
//     }
//   }
// ]
module.exports = async ({owner, repo, token, page = 1, perPage = 10, debug}) => {
  try {
    const {data} = await axios.get(`https://api.github.com/repos/${owner}/${repo}/tags`, {
      params: {page, per_page: perPage},
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${token}`,
        'User-Agent': 'Axios',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    if (debug) {
      console.log('github-create-downstream-release-branch.get-tags()', data)
    }
    return data
  } catch (error) {
    logGithubError(error, {
      context: 'github-create-downstream-release-branch.get-tags',
      owner,
      repo
    })
    throw error
  }
}
