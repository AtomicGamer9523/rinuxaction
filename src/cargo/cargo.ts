import * as rscore from "@actions-rs/core";

interface params {
    command: string;
    args: string[];
}

export = async function run(params: params): Promise<void> {
    let program = await rscore.Cargo.get();
    let args: string[] = [];
    args.push("+nightly");
    args.push(params.command);
    args = args.concat(params.args);

    await program.call(args);
}
