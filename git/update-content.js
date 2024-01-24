const request = require('request-promise')

// https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#create-or-update-file-contents
//
// @return
module.exports = async ({
  owner, repo, token, path, message, content, sha, branch
}) => {
  try {
    return await request({
      method: 'PUT',
      uri: `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      body: {message, content, sha, branch},
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`,
        'User-Agent': 'Request-Promise',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      json: true
    })
  } catch (error) {
    console.log('github-create-downstream-relase-branch.update-content: failed')
    throw error
  }
}
