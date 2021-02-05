// noinspection DuplicatedCode,ThisExpressionReferencesGlobalObjectJS,JSUnusedLocalSymbols
(function(global) {
	console.log('╔═╗╔╦╗╦ ╦╔═╗╔═╗╔╦═╗╦╔═╗\n' +
				'╠═ ║║║║ ║╠═╝╠═  ║ ║║╠═╣\n' +
				'╚═╝╩ ╩╚═╝╩  ╚═╝═╩═╝╩╩ ╩');

	var $document						= null;
	var $window							= null;
	var $html							= null;
	var $body							= null;
	var $container						= null;
	var $canvas							= null;
	var $progress						= null;
	var video							= null;
	var multiplayer						= false;

	// noinspection JSFileReferences,JSUnresolvedFunction
	requirejs.config({
		waitSeconds: 300,
		paths: {
			browserfs: 'libraries/browserfs-1.4.3.min',
			megajs: 'libraries/megajs-0.17.2',
			dropbox: 'libraries/dropbox-4.0.30.min',
			simplestorage: 'libraries/simplestorage-0.2.1.min',
			es6promise: 'libraries/polyfill-es6-promise-auto-4.2.8.min',
			es6fetch: 'libraries/polyfill-es6-fetch-3.0.0',
			jquery: 'libraries/jquery-3.5.0.min',
			json: 'libraries/requirejs-json-1.0.3',
			text: 'libraries/requirejs-text-2.0.15'
		},
		shim: {
			browserfs: {
				exports: 'BrowserFS',
				deps: ['es6promise'],
				init: function(es6promise) {
					window.Promise = es6promise;
				}
			},
			es6promise: {
				exports: 'Promise'
			},
			megajs: {
				exports: 'mega'
			}
		}
	});

	// noinspection JSCheckFunctionSignatures,JSUnusedLocalSymbols
	requirejs([
		'jquery',
		'browserfs',
		'megajs',
		'es6fetch',
		'simplestorage'
	], function($, BrowserFS, mega, fetch, simplestorage) {
		// noinspection DuplicatedCode
		$(function() {
			$document	= $(document);
			$window		= $(window);
			$html		= $('html');
			$body		= $('body');
			$container	= $('.container');
			$canvas		= $('div.fullscreen');
			$progress	= $body.find('progress').first();
			// noinspection JSUnresolvedFunction
			(function() {
				if (typeof simplestorage.get('intro') === 'undefined') {
					video = $('<video />', {
						class: 'fullscreen',
						src: 'media/sierra.mp4',
						type: 'video/mp4',
						preload: 'auto',
						autoplay: true
					});

					// noinspection DuplicatedCode
					$(video).off('ended').one('ended', function() {
						$(video).attr('src', 'media/valve.mp4');
						$(video).off('ended').one('ended', function() {
							$(video).remove();

							video = $('<video />', {
								src: 'media/logo.mp4',
								type: 'video/mp4',
								preload: 'auto',
								autoplay: true,
								muted: true,
								loop: true
							});

							simplestorage.set('intro', true);
							$container.find('.logo').append(video);
						});
					}).off('click').one('click', function() {
						$(video).attr('src', 'media/valve.mp4');
						$(video).off('click').one('click', function() {
							$(video).remove();

							video = $('<video />', {
								src: 'media/logo.mp4',
								type: 'video/mp4',
								preload: 'auto',
								autoplay: true,
								muted: true,
								loop: true
							});

							simplestorage.set('intro', true);
							$container.find('.logo').append(video);
						});
					});

					$container.prepend(video);
				} else {
					video = $('<video />', {
						src: 'media/logo.mp4',
						type: 'video/mp4',
						preload: 'auto',
						autoplay: true,
						muted: true,
						loop: true
					});

					$container.find('.logo').append(video);
				}

				var canvas = $('<canvas/>', {
					id: 'canvas',
					oncontextmenu: 'event.preventDefault()'
				});

				$canvas.append(canvas);
				$container.find('.menu button').attr('disabled', 'disabled');
			})();

			var moduleCount = 0;
			var run = null;
			var mfs = null;

			function loadModule(name) {
				var script = document.createElement('script');

				script.onload = function() {
					moduleCount++;

					if (moduleCount === 3) {
						initEvents();
					}
				};

				document.body.appendChild(script);
				script.src = name + '.js';
			}

			function mountZIP(data) {
				var Buffer = BrowserFS.BFSRequire('buffer').Buffer;
				// noinspection JSUnresolvedFunction
				mfs.mount('/zip', new BrowserFS.FileSystem.ZipFS(Buffer.from(data)));

				try {
					// noinspection JSUnresolvedVariable
					FS.mount(new BrowserFS.EmscriptenFS(), {root: '/zip'}, '/rodir');
				} catch (e) {
					var canvas = $('<canvas/>', {
						id: 'canvas',
						oncontextmenu: 'event.preventDefault()'
					});

					$canvas.html('').append(canvas).hide();

					// noinspection JSUnresolvedVariable,JSUnresolvedFunction
					FS.unmount('/rodir');
					// noinspection JSUnresolvedVariable
					FS.mount(new BrowserFS.EmscriptenFS(), {root: '/zip'}, '/rodir');
				}
			}

			function fetchZIP(packageName, cb) {
				console.log(packageName);

				$progress.css({
					visibility: 'visible'
				});

				var link = '';

				switch (packageName) {
					case 'dayone.zip':
						link = 'https://mega.nz/file/BMEkQByB#ZP_vNxkqvOu8Vsgryh_YRlEXgzk433Vyw7HxhNWGqq4';
						break;
					case 'hc.zip':
						link = 'https://mega.nz/file/YFNWmbRQ#AXp0fKCG0y-3k1VKJLdjT-IjrYd4v_8G3JVVRxMCLa8';
						break;
					case 'hl.zip':
						link = 'https://mega.nz/file/YFNWmbRQ#AXp0fKCG0y-3k1VKJLdjT-IjrYd4v_8G3JVVRxMCLa8';
						break;
					case 'hldm.zip':
						link = 'https://mega.nz/file/RQ8njQIQ#jjrJpmJfBJ3RhVrgp8ntwmxw4Ofxo-uRXE76yYRu3QA';
						break;
					case 'uplink.zip':
						link = 'https://mega.nz/file/AZtDCI6A#sAfEYmV3QWk5bGs6n_7Ol5Vq5HtuUgj9a_Hrre8xx_E';
						break;
				}

				// noinspection JSUnresolvedFunction
				var file = mega.File.fromURL(link);

				// noinspection JSUnresolvedFunction
				file.loadAttributes(function(error, file) {
					file.download(function (err, data) {
						if (err) throw err
						mountZIP(data);
						$progress.css({
							visibility: 'hidden'
						});

						$canvas.show();
						cb();
					})
				})
			}

			function init() {
				run = window.Module.run;
				window.run = window.Module.run = function() {};

				window.ENV.XASH3D_GAMEDIR = 'valve';
				window.ENV.XASH3D_RODIR = '/rodir';

				loadModule('js/server');
				loadModule('js/client');
				loadModule('js/menu');
			}

			function initEvents() {
				$container.find('.menu button').removeAttr('disabled');

				$document.off('click', '.menu button').on('click', '.menu button', function() {
					if (!$(this).is('[disabled]')) {
						start($(this).attr('class'));
					}
				});

				window.onerror = function (event) {
					if (('' + event).indexOf('SimulateInfiniteLoop') > 0) {
						if (!multiplayer) {
							window.location = window.location;
						}
					}
				};
			}

			function start(game) {
				try {
					window.FS.mkdir('/rodir');
					window.FS.mkdir('/xash');
				} catch (e) {}

				mfs = new BrowserFS.FileSystem.MountableFileSystem();
				BrowserFS.initialize(mfs);
				window.FS.chdir('/xash/');

				switch(game) {
					case 'hc':
						window.Module.arguments = ['-dev', '1', '+sv_cheats', '1', '+map', 't0a0'];
						break;
					case 'uplink':
						window.Module.arguments = ['-dev', '1', '+sv_cheats', '1', '+map', 'hldemo1'];
						break;
					case 'dayone':
						window.Module.arguments = ['-dev', '1', '+sv_cheats', '1', '+map', 'c0a0'];
						break;
					case 'hl':
						window.Module.arguments = ['-dev', '1', '+sv_cheats', '1', '+map', 'c0a0'];
						break;
					case 'hldm':
						multiplayer = true;
						//window.Module.arguments = ['-dev', '1', '+sv_cheats', '0', '+sv_lan', '1', '+map', 'crossfire'];
						break;
				}

				window.Module.run = window.run = run;
				fetchZIP(game + '.zip', run);
			}

			// noinspection JSUnresolvedVariable
			if (SYSTEM_FEATURE_CANVAS && SYSTEM_FEATURE_TYPED_ARRAYS && SYSTEM_FEATURE_ASMJS) {
				// noinspection DuplicatedCode
				if (SYSTEM_FEATURE_SERVICE_WORKERS) {
					navigator.serviceWorker.register('sw.js').then(function(registration) {
						registration.addEventListener('updatefound', function() {
							var installingWorker = registration.installing;
							console.log('A new service worker is being installed:', installingWorker);
						});
					}, function(err) {
						console.log('ServiceWorker registration failed: ', err);
					});
				} else {
					console.log('ServiceWorker not supported');
				}

				// noinspection DuplicatedCode
				window.Module = {
					TOTAL_MEMORY: 150 * 1024 * 1024,
					preInit: [init],
					preRun: [],
					postRun: [],
					print: function() {},
					printErr: function() {},
					canvas: $container.find('canvas').get(0),
					setStatus: function(text) {
						var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
						var progressElement = $progress.get(0);

						if (m) {
							progressElement.value = parseInt(m[2]) * 100;
							progressElement.max = parseInt(m[4]) * 100;
						} else {
							progressElement.value = null;
							progressElement.max = null;
						}
					},
					totalDependencies: 0,
					monitorRunDependencies: function (left) {
						this.totalDependencies = Math.max(this.totalDependencies, left);

						if (left) {
							window.Module.setStatus('Preparing... (' + (this.totalDependencies - left) + '/' + this.totalDependencies + ')');
						}
					},
					websocket: {
						url: 'wsproxy://ws.emupedia.net:2000/'
					}
				};
				window.ENV = {};
				// noinspection JSUnusedLocalSymbols
				window.showElement = function(id, show) {
					console.log(id);
				};

				(function() {
					var memoryInitializer = 'js/xash.html.mem';

					if (typeof Module['locateFile'] === 'function') {
						memoryInitializer = Module['locateFile'](memoryInitializer);
					} else if (Module['memoryInitializerPrefixURL']) {
						memoryInitializer = Module['memoryInitializerPrefixURL'] + memoryInitializer;
					}

					var xhr = Module['memoryInitializerRequest'] = new XMLHttpRequest();
					xhr.open('GET', memoryInitializer, true);
					xhr.responseType = 'arraybuffer';
					xhr.send(null);
				})();

				var script = document.createElement('script');
				script.src = 'js/xash.js';
				document.body.appendChild(script);
			} else {
				alert('Half-Life cannot work because your browser is not supported!')
			}
		});
	});
} (this));