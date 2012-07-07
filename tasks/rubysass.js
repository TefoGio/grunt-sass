module.exports = function( grunt ) {
	'use strict';

	var path = require('path');
	var _ = grunt.util._;

	grunt.registerMultiTask( 'rubysass', 'Compile SASS .scss/.sass using Ruby SASS', function() {
		var cb = this.async();
		var opts = this.options();

		this.files.forEach(function( el ) {
			var sass;
			var src = el.src;
			var args = [ el.dest, '--stdin' ];
			var files = grunt.file.expandFiles( src );
			var max = grunt.helper( 'concat', files );

			// Options -> CLI parameters
			Object.keys( opts ).forEach(function( el ) {
				var val = opts[ el ];

				el = el.replace( /[A-Z]/g, function( match ) {
					return '-' + match.toLowerCase();
				});

				if ( val === true ) {
					args.push( '--' + el );
				}

				if ( _.isString( val ) ) {
					args.push( '--' + el, val );
				}
			});

			if ( path.extname( src ) === '.scss' ) {
				args.push('--scss');
			}

			sass = grunt.util.spawn({
				cmd: 'sass',
				args: args
			}, function( err ) {
				if ( err ) {
					grunt.fail.fatal( err );
				}
				cb();
			});

			sass.stdin.write( new Buffer( max ) );
			sass.stdin.end();
			sass.stdout.pipe( process.stdout );
			sass.stderr.pipe( process.stderr );
		});
	});
};