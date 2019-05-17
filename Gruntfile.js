/* global module:false */
module.exports = function(grunt) {

    var CLOSURE_COMPILER_PATH = '../../closure-compiler/'; // ./build/compiler.jar

    // closure-compiler
    require('./grunt-closure-compiler')(grunt);

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // IIFE
        iife: {

            // global scripts (loaded on every page in wp-admin/)
            funnelql: {
                options: {
                    useStrict: true,
                    prependSemicolon: false,
                    trimCode: true,
                    args: ['window'],
                    params: ['win', 'undefined']
                },
                files: {
                    'iife/funnelql.js': [

                        // global
                        'src/global.js',
                        'src/event-emitter.js',
                        'src/event-handlers.js',
                        'src/regex.js',
                        'src/md5.js',
                        'src/debug.js',
                        'src/error.js',

                        // database (web worker)
                        'src/db.js',

                        // parser
                        'src/parser.js',
                        'src/query.js',
                        'src/query-fn.js',

                        // navigation & tag registration
                        'src/funnel-nav.js',
                        'src/funnel-tag.js',

                        // public controller
                        'src/init.js',
                        'src/public.js'
                    ]
                }
            },

            "funnelql-worker": {
                options: {
                    useStrict: true,
                    prependSemicolon: false,
                    trimCode: true,
                    args: ['self'],
                    params: ['self', 'undefined']
                },
                files: {
                    'iife/funnelql-worker.js': [

                        // global
                        'src/worker/global.js',
                        'src/worker/debug.js',
                        'src/worker/error.js',
                        'src/worker/md5.js',
                        'src/worker/regex.js',

                        // parser
                        'src/worker/parser-regex.js',
                        'src/worker/parser-parenthesis.js',
                        'src/worker/parser.js',
                        'src/worker/query-match-tag.js',
                        'src/worker/query-match-times.js',
                        'src/worker/query-match-urls.js',
                        'src/worker/query-path.js',
                        'src/worker/query-sequence.js',
                        'src/worker/query-since.js',
                        'src/worker/query-fn.js',
                        'src/worker/query.js',

                        // database
                        'src/worker/db.js',
                        'src/worker/funnel-nav.js',
                        'src/worker/funnel-tag.js',

                        // message handler
                        'src/worker/messagehandler.js'
                    ]
                }
            }
        },

        // minify
        uglify: {

            // IIFE 
            funnelql: {
                options: {
                    properties: true,
                    dead_code: true,
                    join_vars: true,
                    compress: {
                        global_defs: {
                            NODEBUG: false,
                            WORKER_CODE: false
                        }
                    },
                    mangle: {
                        keep_fnames: true
                    },
                    banner: ''
                },
                files: {
                    'min/funnelql.js': [
                        'iife/funnelql.js'
                    ]
                }
            },

            // IIFE 
            "funnelql-nodebug": {
                options: {
                    properties: true,
                    dead_code: true,
                    join_vars: true,
                    compress: {
                        global_defs: {
                            NODEBUG: true,
                            DEBUG: false,
                            WORKER_CODE: false
                        }
                    },
                    mangle: {
                        keep_fnames: true
                    },
                    banner: ''
                },
                files: {
                    'min/funnelql.nodebug.js': [
                        'iife/funnelql.js'
                    ]
                }
            },

            // web worker blob
            "funnelql-blob": {
                options: {
                    properties: true,
                    dead_code: true,
                    join_vars: true,
                    compress: {
                        global_defs: {
                            NODEBUG: false,
                            WORKER_CODE: (grunt.file.exists('dist/funnelql-worker.js') ? grunt.file.read('dist/funnelql-worker.js') : '')
                        }
                    },
                    mangle: {
                        keep_fnames: true
                    },
                    banner: ''
                },
                files: {
                    'min/funnelql+inline-worker.js': [
                        'iife/funnelql.js'
                    ]
                }
            },

            // web worker blob
            "funnelql-blob-nodebug": {
                options: {
                    properties: true,
                    dead_code: true,
                    join_vars: true,
                    compress: {
                        global_defs: {
                            NODEBUG: true,
                            DEBUG: false,
                            WORKER_CODE: (grunt.file.exists('dist/funnelql-worker.js') ? grunt.file.read('dist/funnelql-worker.js') : '')
                        }
                    },
                    mangle: {
                        keep_fnames: true
                    },
                    banner: ''
                },
                files: {
                    'min/funnelql+inline-worker.nodebug.js': [
                        'iife/funnelql.js'
                    ]
                }
            },

            // web worker
            "funnelql-worker": {
                options: {
                    dead_code: false,
                    properties: true,
                    join_vars: true,
                    compress: {
                        global_defs: {
                            NODEBUG: false
                        }
                    },
                    mangle: {
                        keep_fnames: true
                    },
                    banner: ''
                },
                files: {
                    'min/funnelql-worker.js': [
                        'iife/funnelql-worker.js'
                    ]
                }
            },

            // web worker
            "funnelql-worker-nodebug": {
                options: {
                    dead_code: false,
                    properties: true,
                    join_vars: true,
                    compress: {
                        global_defs: {
                            NODEBUG: true,
                            DEBUG: false
                        }
                    },
                    mangle: {
                        keep_fnames: true
                    },
                    banner: ''
                },
                files: {
                    'min/funnelql-worker.nodebug.js': [
                        'iife/funnelql-worker.js'
                    ]
                }
            }
        },

        // closure compiler
        'closure-compiler': {
            funnelql: {
                closurePath: CLOSURE_COMPILER_PATH,
                js: 'min/funnelql.js',
                jsOutputFile: 'dist/funnelql.js',
                noreport: true,
                maxBuffer: 2500,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    externs: ['./ext.funnelql.js', './ext.codemirror.js']
                }
            },
            "funnelql-blob": {
                closurePath: CLOSURE_COMPILER_PATH,
                js: 'min/funnelql+inline-worker.js',
                jsOutputFile: 'dist/funnelql+inline-worker.js',
                noreport: true,
                maxBuffer: 2500,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    externs: ['./ext.funnelql.js', './ext.codemirror.js']
                }
            },
            "funnelql-nodebug": {
                closurePath: CLOSURE_COMPILER_PATH,
                js: 'min/funnelql.nodebug.js',
                jsOutputFile: 'dist/funnelql.nodebug.js',
                noreport: true,
                maxBuffer: 2500,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    externs: ['./ext.funnelql.js', './ext.codemirror.js']
                }
            },
            "funnelql-blob-nodebug": {
                closurePath: CLOSURE_COMPILER_PATH,
                js: 'min/funnelql+inline-worker.nodebug.js',
                jsOutputFile: 'dist/funnelql+inline-worker.nodebug.js',
                noreport: true,
                maxBuffer: 2500,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    externs: ['./ext.funnelql.js', './ext.codemirror.js']
                }
            },

            "funnelql-worker": {
                closurePath: CLOSURE_COMPILER_PATH,
                js: 'min/funnelql-worker.js',
                jsOutputFile: 'dist/funnelql-worker.js',
                noreport: true,
                maxBuffer: 2500,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    externs: ['./ext.funnelql.js', './ext.codemirror.js']
                }
            },

            "funnelql-worker-nodebug": {
                closurePath: CLOSURE_COMPILER_PATH,
                js: 'min/funnelql-worker.nodebug.js',
                jsOutputFile: 'dist/funnelql-worker.nodebug.js',
                noreport: true,
                maxBuffer: 2500,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT',
                    externs: ['./ext.funnelql.js', './ext.codemirror.js']
                }
            }
        },

        // add header
        header: {
            global: {
                options: {
                    text: '/*! FunnelQL v<%= pkg.version %>\n * (c) https://funnelql.com/ */'
                },
                files: [{
                    expand: true,
                    src: 'dist/*.js',
                    dest: ''
                }]
            }
        }
    });

    // Load Dependencies
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('build', [
        'iife',
        'uglify',
        'closure-compiler',
        'header'
    ]);

    grunt.registerTask('fql', [
        'iife:funnelql',
        'uglify:funnelql',
        'closure-compiler:funnelql',
        'header'
    ]);

    grunt.registerTask('worker', [
        'iife:funnelql-worker',
        'uglify:funnelql-worker',
        'closure-compiler:funnelql-worker',
        'header'
    ]);

    grunt.registerTask('default', ['build']);
};