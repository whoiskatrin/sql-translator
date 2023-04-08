module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node'
};
process.env = Object.assign(process.env, {
    OPENAI_API_KEY: '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'
});