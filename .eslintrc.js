
module.exports = {
    "parserOptions": {
        "ecmaVersion": 8
    },
    "env": {
        "browser": false,
        "node": true,
        "commonjs": true,
        "es6": true,
        "mocha": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "no-console": 0,
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "space-before-function-paren": [
            "error",
            {"anonymous": "always", "named": "never"}
        ],
        "max-len": [
            "error",
            120
        ]
    }
};
