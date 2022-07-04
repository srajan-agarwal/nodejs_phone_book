import path from 'path'
import webpack, { Configuration } from 'webpack'
import WebpackShellPluginNext from 'webpack-shell-plugin-next'

const isDev = process.env.NODE_ENV === 'development'
const envMode = isDev ? 'development' : 'production'

const plugins: any[] = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'dev'),
  }),
]

if (isDev) {
  plugins.push(
    new WebpackShellPluginNext({
      onBuildEnd: {
        scripts: ['npm run run:dev'],
        blocking: false,
        parallel: true,
      },
    }),
  )
}

const config: Configuration = {
  target: 'node',
  entry: './src/server.ts',
  mode: envMode,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  watch: isDev == true,
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', '.tsx'],
  },
  plugins: plugins,
}

export default config
