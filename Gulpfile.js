const gulp = require('gulp'),
	pug = require('gulp-pug'),
//	scss = require('gulp-scss'),
	sass = require('gulp-sass'),
	childProcess = require('child_process');

gulp.task('default',	() => childProcess.spawn('node', ['index.njs']));

gulp.task('upload',	() => childProcess.spawn('git', ['push', '-u', 'origin', 'upload']));
//gulp.task('download',	() => childProcess.spawn('git', []));

const compile = {
	pug:	() => gulp.src('pug/**/*.pug')
			.pipe(pug())
			.pipe(gulp.dest('html')),
	sass:	() => gulp.src('scss/**/*.scss')
//			.pipe(scss({tmpPath: './tmp/scss'}))
			.pipe(sass
				.sync({outputStyle: 'compressed'})
				.on('error', sass.logError))
			.pipe(gulp.dest('resources/css')),
	all:	() => {
		var a = Object
			.keys(this)
			.filter(v => typeof this[v] === 'function'),
		i = a.length - 1;
		for(a.shift('all'); i >= 0; i--){
			if(this.hasOwnProperty(i)) this[i]();
		}
	}
};
const watch = {
	sass:	() => gulp.watch('scss/**/*.scss', ['scss']),
	pug:	() => gulp.watch('pug/**/*.pug', ['pug']),
	all:	() => {
		/*for(var i in this){
			if(this.hasOwnProperty(i)
			&& typeof this[i] === 'function')
				this[i]();
		}*/watch.sass();watch.pug();
	}
};
gulp.task('jade',	compile.pug);
gulp.task('pug',	compile.pug);
gulp.task('scss',	compile.sass);
gulp.task('sass',	compile.sass);
gulp.task('compile',	compile.all);
gulp.task('compile:all',	compile.all);
gulp.task('compile:jade',	compile.pug);
gulp.task('compile:pug',	compile.pug);
gulp.task('compile:scss',	compile.sass);
gulp.task('compile:sass',	compile.sass);

gulp.task('sass:watch',	watch.sass);
gulp.task('jade:watch',	watch.pug);
gulp.task('pug:watch',	watch.pug);
gulp.task('watch:sass',	watch.sass);
gulp.task('watch:jade',	watch.pug);
gulp.task('watch:pug',	watch.pug);

gulp.task('watch',	watch.all);
gulp.task('watch:all',	watch.all);
