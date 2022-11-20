import * as core from "@actions/core";

import toolchain from "./toolchain/toolchain";
import release from "./release/release";
import { execCmd } from "./utils/utils";
import python from "./python/python";
import cargo from "./cargo/cargo";


async function main(): Promise<void> {
    console.log("Initializing action...");
    try {
        console.log("Installing python...");
        await python();
        core.debug("Python installed.");
        console.log("Running python command...");
        await execCmd("python", ["x.py", "init"]);
        core.debug("Python command ran.");
        console.log("Installing rust toolchain...");
        await toolchain();
        core.debug("Rust Toolchain installed.");
        console.log("Installing cargo...");
        await cargo({
            command: "build",
            args: ["--release"]
        });
        core.debug("Cargo installed.");
        console.log("bootstrapping...");
        await execCmd("cargo", ["bootimage","--release"]);
        core.debug("bootstrapped.");
        console.log("releasing package...");
        await release("RustOS", "RustOS release", false);
    } catch (error) {
        core.setFailed((<Error>error).message);
    }
    console.log("Action completed.");
}

void main();