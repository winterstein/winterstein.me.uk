import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import Misc from '../base/components/Misc';
import MainDiv from './MainDiv';

// Import root LESS file so webpack finds & renders it out to main.css
import '../../style/main.less';

// Pass font awesome version onto Misc, so it adds the appropiate class to the icons
Misc.FontAwesome = 5;

// global jquery for You-Again
window.$ = $;

ReactDOM.render(
	<MainDiv />,
	document.getElementById('mainDiv')
	);


	// https://query.wikidata.org/#%23Books%20by%20a%20given%20Author%20including%20genres%20and%20year%20of%20first%20publication%0ASELECT%20distinct%20%3Fbook%20%3FbookLabel%20%3FauthorLabel%20%3FpublicationDate%0AWHERE%0A%7B%0A%09VALUES%20%3Fbk%20%7B%20wd%3AQ571%20wd%3AQ47461344%7D%20%0A%09%3Fbook%20wdt%3AP31%20%3Fbk%20.%0A%20%20%3Fbook%20wdt%3AP50%20%3Fauthor%20.%0A%0A%3Fbook%20rdfs%3Alabel%20%3FbookLabel%20.%0A%3Fauthor%20rdfs%3Alabel%20%3FauthorLabel%20.%0A%0AFILTER%28contains%28lcase%28%3FbookLabel%29%2C%20%22the%20time%20traveler%27s%20wife%22%29%29.%0A%0AFILTER%20%28LANG%28%3FbookLabel%29%3D%22en%22%29%0A%20%20FILTER%20%28LANG%28%3FauthorLabel%29%3D%22en%22%29%0A%0A%20%20OPTIONAL%20%7B%0A%20%20%20%20%3Fbook%20wdt%3AP577%20%3FpublicationDate%20.%0A%20%20%7D%0A%0A%7D%20limit%201%0A
// 	#Books by a given Author including genres and year of first publication
// SELECT distinct ?book ?bookLabel ?authorLabel ?publicationDate
// WHERE
// {
// 	VALUES ?bk { wd:Q571 wd:Q47461344} 
// 	?book wdt:P31 ?bk .
//   ?book wdt:P50 ?author .

// ?book rdfs:label ?bookLabel .
// ?author rdfs:label ?authorLabel .

// FILTER(contains(lcase(?bookLabel), "the time traveler's wife")).

// FILTER (LANG(?bookLabel)="en")
//   FILTER (LANG(?authorLabel)="en")

//   OPTIONAL {
//     ?book wdt:P577 ?publicationDate .
//   }

// } limit 1
