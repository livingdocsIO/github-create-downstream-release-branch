const _ = require('lodash')
const gitGetTags = require('./git/get-tags')
const gitGetTag = require('./git/get-tag')
const gitGetContent = require('./git/get-content')
const updateContent = require('./git/update-content')
const semver = require('semver')
const gitCreateBranch = require('./git/create-branch')
const createPullRequest = require('./git/create-pull-request')

// @return {'tag': '1.0.1', 'sha': '1234'}
const getHighestTag = async ({repo, owner, token}) => {
  const tagsRaw = await gitGetTags({owner, repo, token})
  return _
    .chain(tagsRaw)
    .map((tag) => {
      return {
        'tag': tag.name,
        'sha': tag.commit.sha
      }
    })
    .reduce((biggest, tag) => {
      if (semver.valid(tag.tag) && semver.gte(tag.tag, biggest.tag)) {
        return tag
      }
      return biggest
    }, {'tag': '0.0.1', 'sha': '0000'})
    .value()
}

// @return {'tag': '1.0.1', 'sha': '1234'}
const getTag = async ({repo, owner, token, tag}) => {
  const response = await gitGetTag({owner, repo, token, tag})
  return {
    'tag': response.tag,
    'sha': response.sha
  }
}

// main application
module.exports = async ({owner, repo, ghToken, branch, tag}) => {
  const token = ghToken
  const baseTagCommit = tag
    // getTag doesn't work properly yet
    // because I always run into this error when trying to update package.json later:
    // 409 - {"message":"package.json does not match b3bcc89acb64937c9bf76ef41429caecae03c825","documentation_url":"https://docs.github.com/rest/repos/contents#create-or-update-file-contents"}
    ? await getTag({repo, owner, token, tag})
    : await getHighestTag({repo, owner, token})

  // get package.json
  const packagePath = 'package.json'
  const packageBase64Obj = await gitGetContent({owner, repo, token, path: packagePath, tag})
  const pkg = Buffer.from(packageBase64Obj.content, 'base64').toString('ascii')
  const packageJSON = JSON.parse(pkg)

  // add release branch info to (package.json).release.branches
  if (packageJSON.release?.branches) {
    packageJSON.release.branches = [branch]
  } else {
    throw new Error(`can't extend package.json release.branches with ${branch}`)
  }
  const updatedPackage = JSON.stringify(packageJSON, null, 2)
  const updatedPackageBase64Obj = Buffer.from(updatedPackage).toString('base64')

  // create release-branch
  console.log(`github-create-downstream-relase-branch: create release branch "${branch}" based on tag "${baseTagCommit.tag}"`) // eslint-disable-line max-len
  await gitCreateBranch({
    owner,
    repo,
    token,
    ref: `refs/heads/${branch}`,
    sha: baseTagCommit.sha
  })

  // create PR branch
  const branchName = `set-semantic-release-for-release-branch-${branch}`
  console.log(`github-create-downstream-relase-branch: create release PR branch "${branchName}" based on tag "${baseTagCommit.tag}"`) // eslint-disable-line max-len
  await gitCreateBranch({
    owner,
    repo,
    token,
    ref: `refs/heads/${branchName}`,
    sha: baseTagCommit.sha
  })

  // add a new commit to the PR branch
  console.log('github-create-downstream-relase-branch: update package.json')
  await updateContent({
    owner,
    repo,
    token,
    path: packageBase64Obj.path,
    message: `fix(release-management): add release branch ${branch} to package.json for semantic release`, // eslint-disable-line max-len
    content: updatedPackageBase64Obj,
    sha: packageBase64Obj.sha,
    branch: branchName
  })

  // create the bump pull request
  const targetBranch = branch
  const pullRequest = await createPullRequest({
    owner,
    repo,
    token,
    title: `Add Semantic Release Settings for Release Branch ${targetBranch}`,
    head: branchName,
    base: targetBranch,
    body: `## Changelog

- Add Semantic Release Settings for Release Branch ${targetBranch}
    `
  })

  return {branch, url: `https://github.com/${owner}/${repo}/tree/${branch}`, pullRequest}
}
