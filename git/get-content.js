const request = require('request-promise')

// https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content
//
// @return
module.exports = async ({owner, repo, token, path}) => {
  try {
    return await request({
      method: 'GET',
      uri: `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`,
        'User-Agent': 'Request-Promise',
        'X-GitHub-Api-Version': '2022-11-28'

      },
      json: true
    })
  } catch (error) {
    console.log('github-create-downstream-relase-branch.get-content: failed')
    throw error
  }
}
