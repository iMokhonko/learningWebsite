let config = {

    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                  'vue-style-loader',
                  'css-loader',
                  'sass-loader'
                ]
              }
        ]
    }
}

module.exports = (env, options) => {
    return config;
};