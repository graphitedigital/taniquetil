import webpack from 'webpack';

export default {
    entry: '',
    output: {
        publicPath: '/',
        path:''
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [
                    /node_modules/
                ],
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: [
                        'react-html-attrs',
                        'transform-class-properties',
                        'transform-decorators-legacy'
                    ]
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            },
            'define.amd': false
        }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: {screw_ie8: true, keep_fnames: true}
        })
    ]
}