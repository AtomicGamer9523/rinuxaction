import * as core from "@actions/core";

import toolchain from "./toolchain/toolchain";
import release from "./release/release";
import { execCmd } from "./utils/utils";
import python from "./python/python";
import cargo from "./cargo/cargo";


async function main(): Promise<void> {
    console.log("Initializing action...");
    try {
        core.debug("Installing python...");
        await python();
        core.debug("Python installed.");
        core.debug("Running python command...");
        await execCmd("python", ["x.py", "init"]);
        core.debug("Python command ran.");
        core.debug("Installing rust toolchain...");
        await toolchain();
        core.debug("Rust Toolchain installed.");
        core.debug("Installing llvm tools...");
        await execCmd(
            "rustup",
            ["component", "add", "llvm-tools-preview"]
        );
        core.debug("LLVM component installed.");
        core.debug("Building cargo...");
        await cargo({
            command: "build",
            args: ["--release"]
        });
        core.debug("Cargo compiled.");
        core.debug("Building bootloader...");
        await execCmd(
            "cargo",
            ["bootimage","--release"]
        );
        core.debug("Bootloader built.");
        core.debug("releasing package...");
        await release("RustOS", "RustOS release", false);
    } catch (error) {
        core.setFailed((<Error>error).message);
    }
    console.log("Action completed :)");
}

void main();