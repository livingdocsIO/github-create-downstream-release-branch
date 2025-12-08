'use strict'

const axios = require('axios')

// https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content
//
// @return
module.exports = async ({owner, repo, token, path, debug}) => {
  try {
    const {data} = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `token ${token}`,
          'User-Agent': 'Axios',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    )
    if (debug) {
      console.log('github-create-downstream-release-branch.get-content()', data)
    }
    return data
  } catch (error) {
    console.error(error)
    console.error('github-create-downstream-release-branch.get-content: failed')
    throw error
  }
}
