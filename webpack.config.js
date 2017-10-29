const path = require('path');

module.exports = {
    entry: './src/UncrapCore.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),  
        filename: 'UncrapCore.js',
        library: 'UncrapCore',
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    }
}
