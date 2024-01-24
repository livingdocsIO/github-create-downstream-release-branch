const request = require('request-promise')

// https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#get-a-reference
//
// @return
// {
//   ref: 'refs/tags/v1.100.16',
//   node_id: 'REF_kwDOJKdGNbNyZWZzL3RhZ3MvdjEuMTAwLjE2',
//   url: 'https://api.github.com/repos/livingdocsIO/livingdocs-20min/git/refs/tags/v1.100.16',
//   object: {
//     sha: '9f2f670944a82c9c7ad739461ead868377a86234',
//     type: 'commit',
//     url: 'https://api.github.com/repos/livingdocsIO/livingdocs-20min/git/commits/9f2f670944a82c9c7ad739461ead868377a86234'
//   }
// }
module.exports = async ({owner, repo, token, tag}) => {
  try {
    const response = await request({
      uri: `https://api.github.com/repos/${owner}/${repo}/git/ref/tags/${tag}`,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`,
        'User-Agent': 'Request-Promise',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      json: true
    })
    return {
      tag: tag,
      sha: response.object.sha
    }

  } catch (error) {
    console.log('github-create-downstream-relase-branch.get-tag: failed')
    throw error
  }
}
