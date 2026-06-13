'use strict'

const axios = require('axios')
const logGithubError = require('./log-github-error')

// https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#create-a-pull-request
module.exports = async ({owner, repo, token, title, head, base, body, debug}) => {
  try {
    const {data} = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/pulls`,
      {title, head, base, body},
      {
        headers: {
          Authorization: `token ${token}`,
          'User-Agent': 'Axios',
          Accept: 'application/vnd.github.groot-preview+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    )
    if (debug) console.log('github-create-downstream-release-branch.create-pull-request()', data)
    return data
  } catch (error) {
    logGithubError(error, {
      context: 'github-create-downstream-release-branch.create-pull-request',
      owner,
      repo
    })
    throw error
  }
}
