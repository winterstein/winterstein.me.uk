/* global navigator */
import React, { Component } from 'react';
import Login from '../base/youagain';

// Plumbing
import DataStore from '../base/plumbing/DataStore';
// import Roles from '../base/Roles';
import C from './C';
// import Crud from '../base/plumbing/Crud'; // Crud is loaded here (but not used here)
// import Profiler from '../base/Profiler';

// Templates

// Pages
import TestPage from '../base/components/TestPage';
import AboutPage from '../base/components/AboutPage';
import BookshopPage from './BookshopPage';
import MainDivBase from '../base/components/MainDivBase';

// DataStore
C.setupDataStore();

const PAGES = {
	test: TestPage,
	about: AboutPage,
	bookshop: BookshopPage
};

Login.app = C.app.service;

const MainDiv = () => {
	return <MainDivBase
		pageForPath={PAGES}
		navbarPages={['bookshop']}
		defaultPage='bookshop'
	/>;
}; // ./MainDiv

export default MainDiv;
