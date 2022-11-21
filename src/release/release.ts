import * as ghub from '@actions/github';

export = async function release(name: string, body: string, prerelease: boolean): Promise<void> {
    // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
    const github = ghub.getOctokit(process.env.GITHUB_TOKEN || '');

    // Get owner and repo from context of payload that triggered the action
    const { owner, repo } = ghub.context.repo;

    // This removes the 'refs/tags' portion of the string, i.e. from 'refs/tags/v1.10.15' to 'v1.10.15'
    const tag = "";
    const draft = true;
    const commitish = ghub.context.sha;

    // Create a release
    // API Documentation: https://developer.github.com/v3/repos/releases/#create-a-release
    // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-create-release
    await github.repos.createRelease({
        owner,
        repo,
        tag_name: tag,
        name,
        body,
        draft,
        prerelease,
        target_commitish: commitish
    });
}