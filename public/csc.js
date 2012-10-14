var images = [];
var imgs = [];

var running = false;
function periodic_poll() {
	$.getJSON("/images.json",{},function(data) {
		if(_.isEqual(data,images)) {
			return;
		}
		images = data;
		if(!running) {
			running = true;
			run();
		}
	})
}

function init() {
	setInterval(periodic_poll,30 * 1000);
	periodic_poll();
}

function run() {
	var cur = $('<div class="bg"><img /></div>');
	var next = $('<div class="bg"><img /></div>');

	cur.css('z-index',1);
	next.css('z-index',0);

	$('body').append(cur).append(next);

	cur.find('img').load(fixsize);
	next.find('img').load(fixsize);

	cur.find('img').attr('src',images[0]);
	next.find('img').attr('src',images[1]);

	function fixsize() {
		var i = $(this);
		var b = i.parent();
		i.removeAttr('width');
		i.removeAttr('height');
		var ratio = i.width() / i.height();
		var bratio = b.width() / b.height();
		if(ratio > bratio) {
			console.log("foo");
			i.css('width','100%');
			i.css('height',b.width() / ratio);
			i.css('left',0);
			i.css('top',(b.height() - i.height()) / 2)
		} else {
			i.css('width',b.height() * ratio);
			i.css('height','100%');
			i.css('top',0);
			i.css('left',(b.width() - i.width()) / 2)
		}
		//i.css('width',800);
		//i.css('height',600);
	}

	var nextindex = 1;

	function nextImage() {
		// Increment nextindex
		nextindex = (nextindex + 1) % images.length;

		// Images are already loaded, fade out current
		function donefading() {
			// (next is really the one displayed now)
			// Bring it to the front.
			next.css('z-index',1);
			// Send current to the back
			cur.css('z-index',0);
			cur.show();
			// Load the next index
			cur.find('img').attr('src',images[nextindex]);
			// Swap cur and next
			var tmp = cur;
			cur = next;
			next = tmp;

			
			setTimeout(nextImage,5000);
		}

		if(true) {
			cur.fadeOut(donefading);
		} else {
			cur.hide();
			donefading();
		}
	}
	setTimeout(nextImage,5000);
}
$(init);
