module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node'
};
process.env = Object.assign(process.env, {
    OPENAI_API_KEY: ''
});