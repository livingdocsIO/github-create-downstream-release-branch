# Description

A simple CLI command to create a release branch for Livingdocs Downstream projects.

#### Workflow
- Create a release branch based on a specific tag or latest tag
- extend package.json.release.branches with information for semantic releases


# Example

### via CLI

```bash
npx github:livingdocsIO/github-create-downstream-release-branch \
  --owner=<gh-owner> \
  --repo=<gh-repo> \
  --gh-token=<your-gh-token> \
  --branch=release-2023-12-24
```


**Arguments**

- `--owner`      (required) Github owner of the repo where you want to create the Pull Request
- `--repo`       (required) Github repo where you want to create the Pull Request
- `--gh-token`   (required) Github token of a user to create the PR with
- `--branch`     (required) Release branch name to be created
- `--tag`        (optional) default: latest tag, create release branch based on that tag
