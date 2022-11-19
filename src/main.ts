import * as core from "@actions/core";

import toolchain from "./toolchain/toolchain";
import release from "./release/release";
import { execCmd } from "./utils/utils";
import python from "./python/python";
import cargo from "./cargo/cargo";


async function main(): Promise<void> {
    console.log("Initializing action...");
    try {
        await python();
        await execCmd("python", ["x.py", "init"]);
        await toolchain();
        await cargo({
            command: "build",
            args: ["--release"]
        });
        await execCmd("cargo", ["bootimage","--release"]);
        await release("RustOS", "RustOS release", false);
    } catch (error) {
        core.setFailed((<Error>error).message);
    }
}

void main();