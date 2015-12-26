var gulp = require('gulp');
var gulpFilter = require('gulp-filter');
var install 	= require('gulp-install');
var rimraf 	= require('rimraf');
var mainBowerFiles = require('main-bower-files');
var runSequence = require('run-sequence');
var minifyCss 	= require('gulp-minify-css');

var js_dest_path = 'assets/lib/js';
var css_dest_path = 'assets/lib/css';
var font_dest_path = 'assets/lib/font';
var jsFilter = gulpFilter('*.js',{restore : true});
var cssFilter = gulpFilter('*.css', {restore : true});
var fontFilter = gulpFilter(['*.eot', '*.svg', '*.ttf', '*.woff*'], {restore : true});

gulp.task('clean', function() { 
	rimraf(js_dest_path, function(){});
	rimraf(css_dest_path, function(){});
    rimraf(font_dest_path, function(){});

	return rimraf("bower_components", function(){});

});



gulp.task('install',function(callback){
	return 	gulp.src(['bower.json', 'package.json'])
		.pipe(install());
});


gulp.task('exportBowerFiles',function(callback){
	return	gulp.src(mainBowerFiles())
	//about js
	.pipe(jsFilter)
		.pipe(gulp.dest(js_dest_path))
		.pipe(jsFilter.restore)

	// handle about css
    .pipe(cssFilter)
	    .pipe(gulp.dest(css_dest_path))
	    .pipe(cssFilter.restore)

    // handle about font
	.pipe(fontFilter)
        .pipe(gulp.dest(font_dest_path))
        .pipe(fontFilter.restore)
});


gulp.task('build',function(callback){
    runSequence('clean','install','exportBowerFiles',callback);
});