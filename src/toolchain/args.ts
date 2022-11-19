export interface ToolchainOptions {
    name: string;
    target: string | undefined;
    default: boolean;
    override: boolean;
    profile: string | undefined;
    components: string[] | undefined;
}

export function getToolchainArgs(): ToolchainOptions {
    return {
        name: "nightly",
        target: "x86_64-unknown-none",
        default: false,
        override: true,
        profile: "minimal",
        components: ["clippy", "rust-src"],
    };
}