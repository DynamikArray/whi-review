const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const cleanCSS =require('gulp-clean-css');
const concat = require ('gulp-concat');
/*
  -- Top Level Funciton --
  gulp.task - define tasks
  gulp.src  - point to files to use
  gulp.dest - point to folder to output
  gulp.watch - watch files and folders for changes
*/

gulp.task('message', function(){
  return console.log('Gulp is running...');
});

//Optimize Images
gulp.task('imageMin', () =>
	gulp.src('src/assets/img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/assets/img'))
);

gulp.task('minify-css', function() {
  return gulp.src('src/assets/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/assets/css'));
});

//scripts
//concats and minifys
gulp.task('scripts',function(){
  gulp.src('src/assets/js/*.js')
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('dist/assets/js'))
});

gulp.task('default', ['message','imageMin','minify-css','scripts']);
