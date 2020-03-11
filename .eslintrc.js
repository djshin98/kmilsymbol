/* rules 에서 "prettier/prettier": "error", 삭제 */

module.exports = {
    extends: "eslint:recommended",
    env: {
        browser: true,
        commonjs: true
    },
    parserOptions: {
        ecmaVersion: 5,
        sourceType: "module"
    },
    plugins: ["prettier"],
    rules: {

        "linebreak-style": 0,
        "no-console": ["error", { allow: ["info", "warn", "error"] }],
        "no-unused-vars": ["error", { vars: "all", args: "none" }],
        semi: ["error", "always"]
    }
};