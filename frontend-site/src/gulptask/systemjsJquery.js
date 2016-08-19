/**
 * Created by JinWYP on 8/1/16.
 */


var gulp   = require('gulp');
var eslint = require('gulp-eslint');
var jspm   = require('gulp-jspm');

var rev = require('gulp-rev');


var sourcePath = {
    'js'            : 'js/**/*',
    'jsConfig'      : 'js/config.js',
    'jsPage'        : 'js/page/**/*',
    'components'    : 'jspm_packages/**/*'
};

var distPath = {
    'js'                               : '../dist/js/',
    'jsPage'                           : 'js/page/',
    'jsPage2'                          : 'js/page2/',
    'components'                       : '../dist/jspm_packages/',
    "manifest"                         : "../dist/rev/"
};



// Lint JavaScript
gulp.task('esLint', function() {
    return gulp.src(sourcePath.js)
        .pipe(eslint({
            "env": {
                "browser": true
            },
            "extends": "eslint:recommended",
            "rules": {
                "no-console":0,
                "indent"          : ["error", 4],
                "linebreak-style" : ["error", "unix"],
                "quotes"          : ["error", "single"],
                "semi"            : ["error", "always", { "omitLastInOneLineBlock": true}],
                "no-extra-semi"   : ["error"],
                "comma-dangle"    : ["error", "never"]
            },
            "parserOptions": {
                "ecmaVersion": 6,
                "sourceType": "module"

            },
        }))
        .pipe(eslint.format())
        .pipe(eslint.failOnError())
});


gulp.task('components', function() {
    gulp.src(sourcePath.components)
        .pipe(gulp.dest(distPath.components));
    gulp.src(sourcePath.jsConfig)
        .pipe(gulp.dest(distPath.js));
});




gulp.task('js-release', ['components'], function(){
    return gulp.src(sourcePath.jsPage)
        .pipe(jspm({
            //inject : true,
            minify : true
        }))
        .pipe(rev())
        .pipe(gulp.dest(distPath.jsPage))
        .pipe(rev.manifest('rev-manifest-js.json'))
        .pipe(gulp.dest(distPath.manifest) );
});



gulp.task('js-release-dev', function(){
    return gulp.src(sourcePath.jsPage)
        .pipe(jspm({
            //inject : true,
            minify : false
        }))
        // .pipe(rev())
        .pipe(gulp.dest(distPath.jsPage2));
        // .pipe(rev.manifest('rev-manifest-js.json'))
        // .pipe(gulp.dest(distPath.manifest) );
});



gulp.task('watchJs', [ 'js-release-dev'],function() {
    gulp.watch(sourcePath.js, ['esLint', 'js-release-dev']);
});




