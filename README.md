> 执行构建本项目脚本
```html
1. npm install
2. npm run dist
```


> 使用gulp搭建
## gulp配置

### package.json

如果你熟悉 npm 则可以利用 package.json 保存所有 npm install --save-dev gulp-xxx 模块依赖和模块版本。

在命令行输入

```
npm init -y
```
最终会在当前目录中创建 package.json 文件并                                                             生成类似如下代码：

```html
{
  "name": "gulp-mall",
  "version": "0.0.0",
  "description": "",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
  },
  "keywords": [
    "gulp",
  ],
  "license": "MIT",
}
```

#### 安装依赖

安装 gulp 到项目（防止全局 gulp 升级后与此项目 gulpfile.js 代码不兼容）

```html
npm install gulp --save-dev
```

此时打开 ```package.json``` 会发现多了如下代码

```html
"devDependencies": {
    "gulp": "^3.8.11"
}
```

声明此项目的开发依赖 gulp

接着安装其他依赖：

```html
npm install gulp-uglify gulp-watch-path stream-combiner2 gulp-sourcemaps gulp-minify-css gulp-autoprefixer gulp-less gulp-ruby-sass gulp-imagemin gulp-util --save-dev
```

此时，```package.json``` 将更新

```html
"devDependencies": {
    "colors": "^1.0.3",
    "gulp": "^3.8.11",
    "gulp-autoprefixer": "^2.1.0",
    "gulp-imagemin": "^2.2.1",
    "gulp-less": "^3.0.2",
    "gulp-minify-css": "^1.0.0",
    "gulp-ruby-sass": "^1.0.1",
    "gulp-sourcemaps": "^1.5.1",
    "gulp-uglify": "^1.1.0",
    "gulp-watch-path": "^0.0.7",
    "stream-combiner2": "^1.0.2"
}
```
当你将这份 gulpfile.js 配置分享给你的朋友时，就不需要将 node_modules/ 发送给他，他只需在命令行输入
```html
npm install
```
就可以检测 ```package.json``` 中的 ```devDependencies``` 并安装所有依赖。

### 设计目录结构

我们将文件分为2类，一类是源码，一类是编译压缩后的版本。文件夹分别为 ```src``` 和 ```dist```。

```html
└── dist/
│
└── src/
```

```dist``` 目录下的文件都是根据 ```src/``` 下所有源码文件构建而成。
在```src/assets/``` 下创建前端资源对应的的文件夹
在```src/``` 下创建每个板块对应的html文件

```html
└── src/
    └── assets/
        ├── css/     *.css  文件
        ├── js/      *.js 文件
        ├── fonts/   字体文件
        └── images/   图片
    └── login/        登录页
    └── App-manage/   应用上架
        ···
└── dist/

```

### 配置JS任务

#### gulp-uglify

压缩```js/```中所有js文件并输出到```dist/js/```中

```html
//压缩js
gulp.task('js', function() {
    gulp.src('src/assets/js/**/*.js')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify().on('error', gutil.log))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/assets/js'));
    gulp.src('src/assets/js/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: 'last 2 versions'
        }))
        .pipe(minifycss().on('error', gutil.log))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/assets/js'))
});
```

```src/assets/js/**/*.js``` 是 glob 语法。

在命令行输入```gulp js```后会出现如下消息，表示已经启动

```html

[15:15:29] Using gulpfile G:\Projects\gulp-mall\gulpfile.js
[15:15:29] Starting 'js'...
[15:15:29] Finished 'js' after 17 ms
```

### 配置CSS任务

我们暂时不想使用LESS或SASS，而是直接编写CSS，但我们需要压缩CSS以提高页面加载速度。

####gulp-minify-css
按照本章中压缩JS的方式，先编写```css```任务

```html
//压缩css
gulp.task('css', function () {
    gulp.src('src/assets/css/**/*.css')
        .pipe(minifycss().on('error', gutil.log))
        .pipe(gulp.dest('dist/assets/css'))
});
```

#### gulp-autoprefixer

autoprefixer 解析 CSS 文件并且添加浏览器前缀到CSS规则里。
通过示例帮助理解

autoprefixer 处理前:

```html
.demo {
    display:flex;
}
```
autoprefixer 处理后：
```html
.demo {
    display:-webkit-flex;
    display:-ms-flexbox;
    display:flex;
}
```
你只需要关心编写标准语法的css，autoprefixer会自动补全。

在 watchcss 任务中加入 autoprefixer:

```html
gulp.task('watchcss', function () {
    gulp.watch('src/assets/css/**/*.css', function (event) {
        var paths = watchPath(event, 'src/assets/', 'dist/');

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath);

        gulp.src(paths.srcPath)
            .pipe(sourcemaps.init())
            .pipe(autoprefixer({
                browsers: 'last 2 versions'
            }))
            .pipe(minifycss())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.distDir))
    })
});
```

如果需要一次性编译所有的css文件。可以配置完整版```css```任务。
```html
//压缩css
gulp.task('css', function () {
    gulp.src('src/assets/css/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: 'last 2 versions'
        }))
        .pipe(minifycss().on('error', gutil.log))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/assets/css'))
});
```

在命令行执行```gulp css```以压缩```src/assets/css/```下所有的.css文件并复制到```dist/css```目录下

### 配置image任务

压缩```src/assets/images```目录下所有image文件
```html
gulp.task('image', function () {
    gulp.src('src/assets/images/**/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/images'))
});
```

### 配置文件复制任务

例如，复制```src/fonts/```文件到```dist/```中

```html
gulp.task('copy', function () {
    gulp.src('src/assets/fonts/**/*')
        .pipe(gulp.dest('dist/fonts/'))
})
```
然后执行```gulp copy```命令

### 提供clean功能

```html
gulp.task('clean', function () {  
  return gulp.src('dist/', {read: false})
    .pipe(clean());
});

```





