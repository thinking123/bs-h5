module.exports = {
    presets: [
        ["@babel/env", {
            "targets": {
                "esmodules": false
            },
            "useBuiltIns": "entry"
        }]
    ],
    plugins:["@babel/plugin-syntax-dynamic-import"]
}
