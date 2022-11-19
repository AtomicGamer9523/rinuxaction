import * as ghub from '@actions/github';

export = async function run(name: string, release: boolean): Promise<void> {
    // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
    const github = ghub.getOctokit(process.env.GITHUB_TOKEN || '');

    // Get owner and repo from context of payload that triggered the action
    const { owner: currentOwner, repo: currentRepo } = ghub.context.repo;

    // This removes the 'refs/tags' portion of the string, i.e. from 'refs/tags/v1.10.15' to 'v1.10.15'
    const tag = "";
    const releaseName = name;
    const body = "Rinux Package";
    const draft = true;
    const prerelease = release;
    const commitish = ghub.context.sha;
    const owner = currentOwner;
    const repo = currentRepo;

    // Create a release
    // API Documentation: https://developer.github.com/v3/repos/releases/#create-a-release
    // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-create-release
    await github.repos.createRelease({
        owner,
        repo,
        tag_name: tag,
        name: releaseName,
        body: body,
        draft,
        prerelease,
        target_commitish: commitish
    });
}