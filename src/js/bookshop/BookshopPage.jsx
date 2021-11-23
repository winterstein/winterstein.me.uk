
import React, { useEffect, useState } from 'react';
import DataStore from '../base/plumbing/DataStore';
import $ from 'jquery';
import Misc from '../base/components/Misc';
import DataClass from '../base/data/DataClass';
import { bind } from 'lodash';
import MDText from '../base/components/MDText';
import { Button } from 'reactstrap';
import PropControl from '../base/components/PropControl';

class StoryBit extends DataClass {
	/** @type {String}  */
	text;
	/** @type {String}  */
	next;
	constructor(base) {
		super();
		DataClass._init(this, base);
	}
};
DataClass.register(StoryBit,'StoryBit');

let unlocked = [];
let showBitIds = ['start'];

const BookshopPage = () => {
	let pvText = DataStore.fetch(['misc', 'story'], () => {
		return $.ajax({
			url:"murder.txt",
			dataType: 'text'
		});
	});

	console.log(pvText);
	if ( ! pvText.resolved) {
		return <Misc.Loading />;
	}

	const bit4Label = DataStore.fetch(['misc', 'storybits'], () => {
		const _bit4Label = {};
		let story = $("" + pvText.value);
		$("div.part", story).each(function () {			
			const bitId = $(this).attr('id');
			let bit = new StoryBit({
				id: bitId,
				text: $(this).text(),
				next: $(this).attr('next'),
				unlocks: []
			});
			_bit4Label[bitId] = bit;
			// unlocks?
			bit.text.replace(/\*\*([a-zA-Z0-9 ]+)\*\*/g, (a,b,c) => {
				let ref = b;
				bit.unlocks.push(ref);
			});
		}); // ./div.part each
		return _bit4Label;
	}).value;

	if ( ! bit4Label) {
		return <>...</>;
	}
	return (<>
		{showBitIds.map((bid, i) => <ShowStoryBit key={bid} bit={bit4Label[bid]} i={i} isLast={i===showBitIds.length-1} />)}
	</>);
};

const doShowBit = (bitId) => {
	showBitIds.push(bitId);
	console.log(showBitIds);
	DataStore.update();
};

const ShowStoryBit = ({bit, isLast}) => {
	if ( ! isLast) {
		return <MDText source={bit.text} />;
	}
	
	bit.unlocks.forEach(bid => {
		if ( ! unlocked.includes(bid)) {
			unlocked.push(bid);
		}
	});
	// if (book) {
	// 	let ms = ["Book: ", "You find ", "You hand him ", "Dr. Bell looks at ", "You refocus Dr Bell's attention with "];
	// 	let m = ms[Math.round(ms.length * Math.random())] || '';
	// 	$("h2", part).text(m + book);
	// }

	// if (bit.next) {
	// 	let button = $("<button class='btn btn-default'>Next</button>");
	// 	button.click(function () {
	// 		showPart(next);
	// 		$(this).fadeOut();
	// 		return false;
	// 	});
	// 	$(this).append(button);
	// } else {
	// 	let input = $("<input class='form-control' type='text'/>");
	// 	input.change(function () {
	// 		let book = $(this).val();
	// 		console.log("Value", book);
	// 		handleInput(book, $(this));
	// 		return false;
	// 	});
	// 	let form = $("<div class='answer'>Prompt Dr Bell with a book.</div>");
	// 	//  &nbsp;&nbsp;&nbsp; <small>Topics to try: "+unlocked.join(", ")+"</small> TODO hints, but have to do lazy form append
	// 	form.append(input);
	// 	$(this).append(form);
	// }	
	return <>
		<MDText source={bit.text} />
		{bit.next?
			<Button onClick={e => doShowBit(bit.next)}>Next</Button>
			: <PropControl label="Prompt Dr Bell with a book" prop='bookTitle' path={['widget','guess']} help={"Topics to try: "+unlocked.join(", ")} />
		}
	</>;
};

export default BookshopPage;
