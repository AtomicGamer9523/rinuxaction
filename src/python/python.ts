import * as core from '@actions/core';
import * as finder from './find-python';
import * as path from 'path';
import * as os from 'os';
import { getCacheDistributor } from './cache-distributions/cache-factory';
import { isCacheFeatureAvailable, IS_MAC } from '../utils/utils';

function isPyPyVersion(versionSpec: string) {
    return versionSpec.startsWith('pypy');
}

async function cacheDependencies(cache: string, pythonVersion: string) {
    const cacheDependencyPath =
        core.getInput('cache-dependency-path') || undefined;
    const cacheDistributor = getCacheDistributor(
        cache,
        pythonVersion,
        cacheDependencyPath
    );
    await cacheDistributor.restoreCache();
}

// function resolveVersionInput(): string {
//     let version = '3.10';
//     let versionFile = core.getInput('python-version-file');

//     if (version && versionFile) {
//         core.warning(
//             'Both python-version and python-version-file inputs are specified, only python-version will be used.'
//         );
//     }

//     if (version) {
//         return version;
//     }

//     if (versionFile) {
//         if (!fs.existsSync(versionFile)) {
//             throw new Error(
//                 `The specified python version file at: ${versionFile} doesn't exist.`
//             );
//         }
//         version = fs.readFileSync(versionFile, 'utf8');
//         core.info(`Resolved ${versionFile} as ${version}`);
//         return version;
//     }

//     logWarning(
//         "Neither 'python-version' nor 'python-version-file' inputs were supplied. Attempting to find '.python-version' file."
//     );
//     versionFile = '.python-version';
//     if (fs.existsSync(versionFile)) {
//         version = fs.readFileSync(versionFile, 'utf8');
//         core.info(`Resolved ${versionFile} as ${version}`);
//         return version;
//     }

//     logWarning(`${versionFile} doesn't exist.`);

//     return version;
// }

export = async function run(): Promise<void> {
    if (IS_MAC) {
        process.env['AGENT_TOOLSDIRECTORY'] = '/Users/runner/hostedtoolcache';
    }

    if (process.env.AGENT_TOOLSDIRECTORY?.trim()) {
        process.env['RUNNER_TOOL_CACHE'] = process.env['AGENT_TOOLSDIRECTORY'];
    }

    core.debug(
        `Python is expected to be installed into ${process.env['RUNNER_TOOL_CACHE']}`
    );
    try {
        const version = "3.10";
        if (version) {
            let pythonVersion: string;
            const arch: string = os.arch();
            if (isPyPyVersion(version)) {
                core.error("Somehow we're trying to install PyPy");
            } else {
                const installed = await finder.useCpythonVersion(
                    version,
                    arch,
                    true,
                    false
                );
                pythonVersion = installed.version;
                core.info(`Successfully set up ${installed.impl} (${pythonVersion})`);
            }

            const cache = core.getInput('cache');
            if (cache && isCacheFeatureAvailable()) {
                await cacheDependencies(cache, pythonVersion);
            }
        } else {
            core.warning(
                'The `python-version` input is not set.  The version of Python currently in `PATH` will be used.'
            );
        }
        const matchersPath = path.join(__dirname, '../..', '.github');
        core.info(`##[add-matcher]${path.join(matchersPath, 'python.json')}`);
    } catch (err) {
        core.setFailed((err as Error).message);
    }
}