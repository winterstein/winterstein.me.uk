
import C from '../base/CBase';
import { addImageCredit } from '../base/components/AboutPage';

Object.assign(C.app, {
	name: "The Bookshop Murder",
	logo: "murder-icon.svg"
});


addImageCredit({
	name: "murder icon",
	author: "Aldric Rodríguez from the Noun Project",
	url: "https://thenounproject.com/search/?q=murder&i=810178"
});

export default C;
