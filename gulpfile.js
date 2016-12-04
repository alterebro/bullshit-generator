var gulp = require('gulp'),
	del = require('del'),
	rename = require('gulp-rename'),
	useref = require('gulp-useref'),
	gulpIf = require('gulp-if'),
	uglify = require('gulp-uglify'),
	replace = require('gulp-replace'),
	fs = require('fs'),
	htmlmin = require('gulp-htmlmin');

gulp.task('clean', function () {
	return del([
		'dist/**/*'
	]);
});

gulp.task('build', ['clean'], function() {
	return	gulp.src("./_app.html")
				.pipe(rename("index.html"))
				.pipe(useref())
				.pipe(gulpIf('*.js', uglify()))
				.pipe(gulp.dest("dist/")); // ./
});

gulp.task('inject', ['build'], function() {
	return 	gulp.src('./dist/index.html') // ./index.html
				.pipe(replace(
					/<link rel="stylesheet" href="(.*?)">/g,
					function(s, filename) {
						var css = fs.readFileSync('./dist/'+filename, 'utf8');
						return '<style>' + css + '</style>';
					})
				)
				.pipe(replace(
					/<script src="(.*?)"><\/script>/g,
					function(s, filename) {
						var js = fs.readFileSync('./dist/'+filename, 'utf8');
						return '<script>' + js + '</script>';
					})
				)
				.pipe(gulp.dest('dist/')); // ./
});

gulp.task('compress', ['inject'], function() {
	return 	gulp.src('./dist/index.html') // ./index.html
			.pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
			.pipe(gulp.dest('dist/')); // ./
});

gulp.task('move', ['compress'], function(){
	var files = [
		'./images/**/*.*',
		'./q.php'
	];
	gulp.src(files, { base: './' })
		.pipe(gulp.dest('dist'));
});

gulp.task('remove', ['move'], function () {
	return del([
		'dist/app.min.css',
		'dist/app.min.js'
	]);
});

gulp.task('default', ['remove']);
