import * as core from "@actions/core";


import toolchain from "./toolchain/toolchain";
import cargo from "./cargo/cargo";


async function main(): Promise<void> {
    console.log("Initializing action...");
    try {
        await toolchain();
        await cargo({
            command: "build",
            args: ["--release"]
        });
    } catch (error) {
        core.setFailed((<Error>error).message);
    }
}

void main();