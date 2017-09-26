(function (global, undefined) {

    var Terminal = Terminal || function(containerID, options) {
	if (!containerID) return;
	//init cmds & consts

	//	    const CMDS_ = [
	//		'about', 'pub', 'clear', 'help','bubble'
	//	    ];
	const CMDS_ = {
	    'about':"My person introduction.",
	    'pub'  :"My publications.",
	    'clear':"Clear the content of this terminal.",
	    "bubble":"A re-make classic frozen bubble game."
	};


	var defaults = {
	    welcome: '',
	    prompt: '',
	    separator: '&gt;',
	    theme: 'interlaced'
	};

	var options = options || defaults;
	options.welcome = options.welcome || defaults.welcome;
	options.prompt = options.prompt || defaults.prompt;
	options.separator = options.separator || defaults.separator;
	options.theme = options.theme || defaults.theme;

	var extensions = Array.prototype.slice.call(arguments, 2);

	var _history = localStorage.history ? JSON.parse(localStorage.history) : [];
	var _histpos = _history.length;
	var _histtemp = '';

	// Create terminal and cache DOM nodes;
	var _terminal = document.getElementById(containerID);
	_terminal.classList.add('terminal');
	_terminal.classList.add('terminal-' + options.theme);
	_terminal.insertAdjacentHTML('beforeEnd', [
	    '<div class="background"><div class="interlace"></div></div>',
	    '<div class="container">',
	    '<output></output>',
	    '<table class="input-line">',
	    '<tr ><td nowrap><div class="prompt">' + options.prompt + options.separator + '</div></td><td width="100%"><input class="cmdline" autofocus /></td></tr>',
	    '</table>',
	    '</div>'].join(''));
	var _container = _terminal.querySelector('.container');
	var _inputLine = _container.querySelector('.input-line');
	var _cmdLine = _container.querySelector('.input-line .cmdline');
	var _output = _container.querySelector('output');
	var _prompt = _container.querySelector('.prompt');
	var _background = document.querySelector('.background');

	// Hackery to resize the interlace background image as the container grows.
	_output.addEventListener('DOMSubtreeModified', function(e) {
	    // Works best with the scroll into view wrapped in a setTimeout.
	    setTimeout(function() {
		_cmdLine.scrollIntoView();
	    }, 0);
	}, false);

	//		if (options.welcome) {
	//			output(options.welcome);

	//		}
	welcome();
	window.addEventListener('click', function(e) {
	    _cmdLine.focus();
	}, false);

	_output.addEventListener('click', function(e) {
	    e.stopPropagation();
	}, false);

	// Always force text cursor to end of input line.
	_cmdLine.addEventListener('click', inputTextClick, false);
	_inputLine.addEventListener('click', function(e) {
	    _cmdLine.focus();
	}, false);

	// Handle up/down key presses for shell history and enter for new command.
	_cmdLine.addEventListener('keyup', historyHandler, false);
	_cmdLine.addEventListener('keydown', processNewCommand, false);

	window.addEventListener('keyup', function(e) {
	    _cmdLine.focus();
	    e.stopPropagation();
	    e.preventDefault();
	}, false);

	function inputTextClick(e) {
	    this.value = this.value;
	}

	function historyHandler(e) {
	    // Clear command-line on Escape key.
	    if (e.keyCode == 27) {
		this.value = '';
		e.stopPropagation();
		e.preventDefault();
	    }

	    if (_history.length && (e.keyCode == 38 || e.keyCode == 40)) {
		if (_history[_histpos]) {
		    _history[_histpos] = this.value;
		}
		else {
		    _histtemp = this.value;
		}

		if (e.keyCode == 38) {
		    // Up arrow key.
		    _histpos--;
		    if (_histpos < 0) {
			_histpos = 0;
		    }
		}
		else if (e.keyCode == 40) {
		    // Down arrow key.
		    _histpos++;
		    if (_histpos > _history.length) {
			_histpos = _history.length;
		    }
		}

		this.value = _history[_histpos] ? _history[_histpos] : _histtemp;

		// Move cursor to end of input.
		this.value = this.value;
	    }
	}

	function processNewCommand(e) {
	    // Only handle the Enter key.
	    if (e.keyCode != 13) return;

	    var cmdline = this.value;

	    // Save shell history.
	    if (cmdline) {
		_history[_history.length] = cmdline;
		localStorage['history'] = JSON.stringify(_history);
		_histpos = _history.length;
	    }

	    // Duplicate current input and append to output section.
	    var line = this.parentNode.parentNode.parentNode.parentNode.cloneNode(true);
	    line.removeAttribute('id')
	    line.classList.add('line');
	    var input = line.querySelector('input.cmdline');
	    input.autofocus = false;
	    input.readOnly = true;
	    input.insertAdjacentHTML('beforebegin', input.value);
	    input.parentNode.removeChild(input);
	    _output.appendChild(line);

	    // Hide command line until we're done processing input.
	    _inputLine.classList.add('hidden');

	    // Clear/setup line for next input.
	    this.value = '';

	    // Parse out command, args, and trim off whitespace.
	    if (cmdline && cmdline.trim()) {
		var args = cmdline.split(' ').filter(function(val, i) {
		    return val;
		});
		var cmd = args[0];
		args = args.splice(1); // Remove cmd from arg list.
	    }

	    /*			if (cmd) {
				var response = false;
				for (var index in extensions) {
				var ext = extensions[index];
				if (ext.execute) response = ext.execute(cmd, args);
				if (response !== false) break;
				}
				if (response === false) response = cmd + ': command not found';
				output(response);
				}*/

	    switch(cmd) {
		//true functions
	    case 'help':
		//help functions
		help();
		break;
	    case 'about':
		about();
		break;
	    case 'clear':
		clear();
		break;
	    case 'bubble':
		bubble();
		break;
	    case 'pub':
		pub();
		break;
	    default:
		if (cmd) {
		    output(cmd + ': command not found');
		}
	    }

	    // Show the command line.
	    _inputLine.classList.remove('hidden');
	}
	function help() {
	    output('Avaliable cmds are: <br />');
	    //		output('<div class="ls-files">' + CMDS_.join('<br>') + '</div>');
	    var s = ""
	    for(var k in CMDS_ ) {
			//s += '<p>' + k + ':  ' +  CMDS_[k] + '</p>'
			s +=  (k + ':  ' + CMDS_[k] + '<br />');
	    }
	    output(s)
	}

		function about() {

			output('<div class="not-align yue">');
			output('<h3>魏星达 XingDa Wei</h3>');
			//		output('715 Broadway Room 719<br>');
			//		output('New York, NY 10003<br>');
			output('Contact: wxdwfc at gmail com<br>');
			output('Github: <a href="https://github.com/wxdwfc/" target="_blank">github.com/wxdwfc</a><br>')

			output('I\'m current a p.h.d candidate\'s candidate student @institute of parallel and distributed systems<a href="http://ipads.se.sjtu.edu.cn" target="_blank">(IPADS)</a>.I\'m working in distributed system group,which is advised by two great professors <a href="http://ipads.se.sjtu.edu.cn/pub/members/rong_chen" target="_blank">Rong Chen</a> & <a href="http://ipads.se.sjtu.edu.cn/pub/members/haibo_chen" target="_blank">Haibo Chen</a>.<br/> This lovely terminal is powered by <a href="https://github.com/SDA/terminal/blob/master/README.md">Termina.js</a><br />');
			output('I\'m a music lover!:)');
			output('</ div">');
	    //		output('<p>This lovely terminal emulator is from Eric Bidelman &lt;ericbidelman@chromium.org&gt; </p>');
	}
	function bubble() {
	    window.open('http://wxdwfc.github.io/github_page/frozen_bubble/main.html');
	    output("<p> The game is started ! Be sure to use an HTML5 supported browser!</p>");
	}

	function pub() {
	    output('<h2>Publications</h2>');
	    output('<p>');
	    output('<b>Fast In-memory Transaction Processing using RDMA and HTM</b>');
	    output('<br>');
	    output('<b>Xingda Wei, Jiaxin Shi, Yanzhe Chen, Rong Chen, Haibo Chen</b>');
	    output('<br>');
	    output('<b> In proceedings of the 25th ACM Symposium on Operating Systems Principles. Monterey, CA, October, 2015.</b>');
	    output('<br>');
	    output('<br>');
	    output('<b>Fast and General Distributed Transactions Using RDMA and HTM</b>');
	    output('<br>');
	    output('<b>Yanzhe Chen, Xingda Wei, Jiaxin Shi, Rong Chen, Haibo Chen</b>');
	    output('<br>');
	    output('<b> In proceedings of the 11th ACM European Conference on Computer Systems Principles.</b>');

		output('<br>');
	    output('<br>');
		output('<b>Replication-driven Live Reconfiguration for Fast Distributed Transaction Processing</b>');
	    output('<br>');
	    output('<b>Xingda Wei,Sijie Shen, Rong Chen, Haibo Chen</b>');
	    output('<br>');
	    output('<b> The 2017 USENIX Annual Technical Conference, SANTA CLARA,CA,USA,July,2017</b>');
	}

	function welcome() {

	    output('<div>Welcome to XingDa\'s home-terminal!' +
		   '</div>');
	    output((new Date()).toLocaleString());
	    about();
	    output('<br />Please type "help" for available commands.');
	}

	function clear() {
	    _output.innerHTML = '';
	    _cmdLine.value = '';
	    _background.style.minHeight = '';
	    welcome();
	}

	function output(html) {
	    _output.insertAdjacentHTML('beforeEnd', html);
	    _cmdLine.scrollIntoView();
	}

	return {
	    clear: clear,
	    setPrompt: function(prompt) { _prompt.innerHTML = prompt + options.separator; },
	    getPrompt: function() { return _prompt.innerHTML.replace(new RegExp(options.separator + '$'), ''); },
	    setTheme: function(theme) { _terminal.classList.remove('terminal-' + options.theme); options.theme = theme; _terminal.classList.add('terminal-' + options.theme); },
	    getTheme: function() { return options.theme; }
	}
    };

    // node.js
    if (typeof module !== 'undefined' && module.exports) {
	module.exports = Terminal;

	// web browsers
    } else {
	var oldTerminal = global.Terminal;
	Terminal.noConflict = function () {
	    global.Terminal = oldTerminal;
	    return Terminal;
	};
	global.Terminal = Terminal;
    }

})(this);
