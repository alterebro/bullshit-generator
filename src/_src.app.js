// ------------------------------------
// Utils
function addclass(el, classname) {
	if (el.classList) { el.classList.add(classname); }
	else { el.className += ' ' + classname; }
}
function removeclass(el, classname) {
	if (el.classList) { el.classList.remove(classname); }
	else { el.className = el.className.replace(new RegExp('(^|\\b)' + classname.split(' ').join('|') + '(\\b|$)', 'gi'), ' '); }
}
function foreach(selector, fn) {
	var elements = document.querySelectorAll(selector);
	for (var i = 0; i < elements.length; i++) { fn(elements[i], i); }
}
function rndint(min, max) { // min incl. - max excl.
	return Math.floor(Math.random() * (max - min)) + min;
}
function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// ------------------------------------
// Bullshit Generator
function suggest(q) {

	var query = q.trim();
		query = query.replace(/<(?:.|\n)*?>/gm, '');
	var url = 'q.php?q=' + encodeURIComponent(query)

	ajax()
		.get(url)
		.then(function(res, xhr){

			if ( res.length == 2 ) {

				var results = []
				for( var i=0; i<res[1].length; i++) {
					var item = res[1][i];
						item = item.replace(query, '').trim();
						item = item.replace(/(\'|\")/g, '');
					if ( item != '' ) { results.push( item ); }
				}
				results.sort(function(a, b) { return b.length - a.length; });

				var suggestion = (results.length > 0 ) ? results[0] : query;
				var next_arr = suggestion.split(' ');
				var next_arr_len = next_arr.length;
				var next = next_arr.slice( rndint(0, next_arr_len) );
					next = (next_arr_len >= 2) ? next.join(' ') : suggestion

				if ( QUERY_CURRENT <= QUERY_LIMIT ) {

					var spacer = ( rndint(0, 100) > 80 ) ? ', ' : ' ';
					BULLSHIT = (QUERY_CURRENT == 0)
						? '“' + ucfirst(query) + ' ' + next
						: BULLSHIT + spacer + next;
					o.innerHTML = BULLSHIT;
					QUERY_CURRENT++
					suggest(next)

				} else {
					BULLSHIT += '...”';
					o.innerHTML = BULLSHIT;
					QUERY_CURRENT = 0;
					// ends

					addclass(p, 'show-options')
				}

			} else {
				// TODO : error handling
				console.log( 'error: ', xhr );
				window.alert('Error. Something went wrong with the request :(')
				close();
			}

		})
		.catch(function(res, xhr) {
			// TODO : error handling
			console.log( 'error: ', xhr );
			window.alert('Error. Something went wrong with the request :(')
			close();
		})

}

// ------------------
// Init
var f = document.querySelector('#form');
var i = document.querySelector('#input');
var o = document.querySelector('#output-content');
var p = document.querySelector('#output-options');
var r = document.querySelector('#output-options .remove');
var t = document.querySelector('#output-options .twitter');

var QUERY_CURRENT = 0;
var QUERY_LIMIT = 20;
var BULLSHIT = '';

// ------------------
// Social Networks
var share 	= document.querySelector('head meta[name="application-name"]')
var url 	= share.getAttribute('data-url');
var title 	= share.getAttribute('data-title');
var tweet 	= share.getAttribute('data-tweet');
var share_params = {
	'twitter' : 'text=' + encodeURIComponent(tweet) + '&amp;url=' + encodeURIComponent(url) + '&amp;via=alterebro',
	'facebook' : 'u=' + encodeURIComponent(url) + '&amp;title=' + encodeURIComponent(title),
	'googleplus' : 'url=' + encodeURIComponent(url),
}
foreach('footer ul li a', function(el, i){
	var ref = el.getAttribute('data-url')
	var uri = ref + share_params[el.className]
	el.href = uri;
	el.onclick = function(e) {
		var w = window.open(this.href, this.target, 'width=550,height=440');
			w.focus()
			e.preventDefault()
			ga('send', 'event', 'event-tracking', 'share-' + this.className);
	}
});

// ------------------
// Events
f.onsubmit = function(e) {

	close();
	if ( i.value.trim() != '' ) {
		suggest(i.value)
		addclass(document.querySelector('body'), 'bullshit');
		i.value = '';
		i.blur();
		ga('send', 'event', 'event-tracking', 'bullshit-done');
	}
	e.preventDefault();

}

function close() {
	o.innerHTML = '';
	removeclass(document.querySelector('body'), 'bullshit');
	removeclass(p, 'show-options')
	QUERY_CURRENT = 0;
}

r.onclick = function(e) {
	close();
	ga('send', 'event', 'event-tracking', 'bullshit-closed');
	e.preventDefault();
}

t.onclick = function(e) {
	var txt = BULLSHIT.replace('“', '').replace('...”', '')
		txt = (txt.length > 113) ? txt.slice(0, 113) : txt;
		txt += '...';

	var uri = this.href + 'text=' + encodeURIComponent(txt) + '&amp;url=' + encodeURIComponent(url);
	var twt = window.open(uri, this.target, 'width=550,height=440');
		twt.focus()

	ga('send', 'event', 'event-tracking', 'bullshit-tweet');
	e.preventDefault()
}

window.onload = function() {
	removeclass(document.querySelector('body'), 'preload');
	// i.focus()
	// if (navigator.userAgent.indexOf('Mac OS X') != -1) { window.location.hash = "💩"; }
}
