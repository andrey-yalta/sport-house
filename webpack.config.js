const path = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
// const htmlLoader = require("html-loader")
const webpack = require('webpack');
const OptimizeCssAssetWebpackPlugin = require("optimize-css-assets-webpack-plugin")
const TerserWebpackPlugin = require("terser-webpack-plugin")
const {BundleAnalyzerPlugin} = require("webpack-bundle-analyzer")
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development' // это значит что если мы будем находится в режиме разработки будет true, если в режиме продакшена = false
const isProd = !isDev

console.log("IS DEV:",isDev)

const optimization =()=>{
    const config =
        { // это для оптимизации
            splitChunks: { // этот модуль обьединяет библиотеки, если они требуются в разных местах кода, чтобы не грузить по 2 раза
                chunks: "all"
            }
        }
    if(isProd){ // оптимизация должна быть только в продакшн моде
        config.minimizer =[
            new OptimizeCssAssetWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config
}
const filename = ext => !isDev? `[name].${ext}`: `[name].[hash].${ext}`
// const filename_img = (ext) => (!isDev ? `[name]${ext}` : `[name].[contenthash]${ext}`);
const cssLoaders = (extra)=>{ // функцию вынесли для css/sass/less обработчиков
    const loaders =[{
        loader: MiniCssExtractPlugin.loader,
        options: {

        },
    },'css-loader']
    if(extra){
        loaders.push(extra)
    }
    return loaders
}

const babelOptions = (preset)=>{
    // это чтобы не дублироват код в бейбле
    const options =
        {
            presets: ['@babel/preset-env'],
            plugins:['@babel/plugin-proposal-class-properties']
        }
    if(preset){
        options.presets.push(preset)
    }
    return options
}

const plugins =()=>{
    const base =[
        new HTMLWebpackPlugin({
            title:"Webpack AndreyYalta", // это мы можем передавать параметры
            template: path.resolve(__dirname,"src/index.html"), // это мы говорим чтобы читало из хтмл файла
            filename: 'index.html',

            // inject:"body",
            minify:{
                collapseWhitespace:!isDev
            }, // это чтобы сжимать и минимизировать html файлы


        }),
        new CleanWebpackPlugin(), // это нужно чтобы удаляло лишние файлы от рендеров в dist
        new CopyPlugin({patterns: [// этот плагин нужно чтобы копировать файл из корневой папки в dist
                {  from:path.resolve(__dirname,"src/favicon.svg"),
                    to:path.resolve(__dirname, "dist")
                }]}),
        new MiniCssExtractPlugin({
            filename: filename('css')
        })]
    if(isProd){
        // base.push(new BundleAnalyzerPlugin())
        base.push(
            new ImageMinimizerPlugin({
                test: /\.(jpe?g|png|gif)$/i,
                minimizerOptions: {
                    plugins: ['pngquant', ['jpegtran', { progressive: true }],],
                },
            }),
        )
    }
    if (isDev) {   //это значит что мы можем изменять некоторые  css без перезагрузки страницы (isDev для того чтобы оно работало только в режиме разработки)
        // only enable hot in development
        base.push( new webpack.HotModuleReplacementPlugin());
    }
    return base
}

const jsLoader =()=>{
    return [{
        loader: "babel-loader",
        options: babelOptions()
    }]
}
const htmlLoaders =()=>{
    return  [{
        loader: 'html-loader',
        options:{

        }
    }]
}
module.exports = {
    context: path.resolve(__dirname,"src" ), // это путь к папке, от которой будут браться файлы здесь (чтобы не прописывать полный путь)
    mode: 'development',
    entry: {// здесь указываем чанки( js файлы)
        main: ['./index.js'],
        // analytics: "./analytics.ts"
    }, // точка вхождения
    output: {
        // assetModuleFilename: `./assets/${filename('[ext]')}`,
        filename: filename('js'), // файл в котором будут итоговые все js крипты
        path: path.resolve(__dirname, "dist"),
        publicPath: ""
    },
    resolve: {
        extensions: ['.js', '.json'],// эта настройка нужна чтобы вебпак мог читать форматы, а мы могли не дописывать в импортах расширения .png
        alias: { // эта херь нужна чтобы было удобно прописывать пути от папок
            // "@models":path.resolve(__dirname,'src/models'),
            "@":path.resolve(__dirname,"src")
        }
    },
    optimization: optimization()
    ,
    devServer: { // это чтобы автоматом перезагружало браузер  и автоматом перекомпилило при изменениях кода
        //еще следует заметить что дев сервер не закидывает постоянно файлы в dist, а хранит в оперативной памяти
        //поэтому папка  dist пуста, когда рпиложение запущено,
        // однако, если завершить процесс - в папке dist появятся файлы
        port:"4200",
        hot:isDev,
        inline:isDev,



    },
    plugins: plugins(),
    devtool: isProd ? false : 'source-map',

    module:{
        rules: [// это нуэнл чтобы читало форматы
            {
                test: /\.css$/, // это регулярые выражения и их синтаксис в js
                use:cssLoaders()
            },
            {
                test: /\.html$/, // это регулярые выражения и их синтаксис в js
                use:htmlLoaders(),

            },
            {
                test: /\.(s[ac]ss)$/, // это регулярые выражения и их синтаксис в js
                use:cssLoaders('sass-loader') // читается справа-налево, поэтому сначала  less, потом уже css
            },
            {
                test: /\.(?:|gif|png|jpg|jpeg|svg)$/i,
                type: 'asset/resource',
            },
            // {
            //     test: /\.(ttf|woff|woff2|eot)$/,
            //     use: ['file-loader']
            // },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoader()
            },
        ]
    }
}