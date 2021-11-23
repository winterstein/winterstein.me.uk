
function loadText(url) {
	console.log("loading", url);
	$.ajax({
		url: url,
		success: loadText2,
		dataType: 'text'
	});
}

function loadText2(result) {
	//    console.log("Success", result);
	let story = $("" + result);
	$("div.part", story).each(function () {
		let text = $(this).text();
		let next = $(this).attr('next');
		if ($(this).attr('id') == 'end') return;
		if (next) {
			let button = $("<button class='btn btn-default'>Next</button>");
			button.click(function () {
				showPart(next);
				$(this).fadeOut();
				return false;
			});
			$(this).append(button);
		} else {
			let input = $("<input class='form-control' type='text'/>");
			input.change(function () {
				let book = $(this).val();
				console.log("Value", book);
				handleInput(book, $(this));
				return false;
			});
			let form = $("<div class='answer'>Prompt Dr Bell with a book.</div>");
			//  &nbsp;&nbsp;&nbsp; <small>Topics to try: "+unlocked.join(", ")+"</small> TODO hints, but have to do lazy form append
			form.append(input);
			$(this).append(form);
		}
	});
	console.log(story);
}

let unlocked = [];

function showPart(id, book) {
	console.log("showPart", id);
	let part = $('#' + id);
	// unlocked refs
	$("strong", part).each(function () {
		let ref = $(this).text().toLowerCase();
		console.log(ref);
		unlocked.push(ref);
		console.log("...unlocked", ref);
		if ($('#' + ref).length != 1) {
			console.log("Bad ref: " + ref + " " + $('#' + ref).length);
		}
	});
	if (book) {
		let ms = ["Book: ", "You find ", "You hand him ", "Dr. Bell looks at ", "You refocus Dr Bell's attention with "];
		let m = ms[Math.round(ms.length * Math.random())] || '';
		$("h2", part).text(m + book);
	}
	part.fadeIn();
	if ($.scrollTo) {
		$.scrollTo(part, 1000);
	}
	if (id == 'end') $('.credits').show();
}

function handleInput(book, $input) {
	if (!book) return;
	console.log("Handle", book, unlocked);
	if (unlocked.indexOf(book.toLowerCase()) !== -1) {
		console.log("ignore just " + book);
		return;
	}
	// if (book.indexOf('cheat ') == 0) {
	//     var part = book.substring(6);
	//     showPart(part);
	//     return;
	// }
	isABook(book, function (result) {
		console.log("Got", book, result);
		if (result == 'FAIL') {
			notifyUser("You cannot find " + book, $input);
			return;
		}
		book = book.toLowerCase();
		for (let i = 0; i < unlocked.length; i++) {
			let part = unlocked[i];
			console.log(part);
			if (book.indexOf(part) == -1) continue;
			showPart(part, result);
			return;
		}
		notifyUser("Bell glances at " + result + " then tosses it aside.", $input);
	});
}

function notifyUser(msg, $input) {
	if (!$input) {
		alert(msg);
		return;
	}
	let $note = "<div class='notify'>" + msg + "</div>";
	$input.parent().append($note);
	setTimeout(function () { $(note).fadeOut(); }, 1000);
}


function isABook(title, callback) {
	$.ajax({
		url: "https://www.winterwell.com/daniel/story/book.php",
		data: { title: title },
		success: function (result) { callback(result); },
		error: function (bleurgh) { callback(); } // assume OK
	});
}

