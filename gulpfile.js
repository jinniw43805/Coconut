var gulp 	= require('gulp');
var gulpFilter 	= require('gulp-filter');
var install 	= require('gulp-install');
var rimraf 	= require('rimraf');
var mainBowerFiles = require('main-bower-files');
var runSequence = require('run-sequence');
var minifyCss 	= require('gulp-minify-css');

var js_dest_path = 'public/javascript/js';
var css_dest_path = 'public/stylesheet/css';

var jsFilter = gulpFilter('*.js',{restore : true});
var cssFilter = gulpFilter('*.css', {restore : true});

gulp.task('clean', function() { 
	rimraf("public/javascript/js/", function(){});
	rimraf("public/stylesheet/css/", function(){});
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
	        .pipe(minifyCss())
	        .pipe(gulp.dest(css_dest_path))
	        .pipe(cssFilter.restore)


});


gulp.task('build',function(callback){
	runSequence('clean','install','exportBowerFiles',callback);
});
