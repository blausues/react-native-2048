module.exports = {
    root: true,
    extends: ['airbnb', '@react-native-community'],
    rules: {
        'react/jsx-filename-extension': [1, {extensions: ['.js', '.jsx']}],
        'react/function-component-definition': [
            2,
            {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function',
            },
        ],
    },
};