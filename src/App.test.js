import React from 'react';
// import { render } from '@testing-library/react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import App, { Search, Button, Table } from './App';


describe('App',()=>{


	it('renders without crashing',()=>{
		const div = document.createElement('div');
		ReactDOM.render(<App />,div);
		ReactDOM.unmountComponentAtNode(div);
	});

	test('has a valid snapshot', ()=>{
		const component = renderer.create(<App /> );
		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});	


});

describe('Search', ()=>{

	it('renders without crashing', ()=>{

		const div = document.createElement('div');
		ReactDOM.render(<Search>Search</Search>,div);
		ReactDOM.unmountComponentAtNode(div);
	});

	test('has a valid snapshot', ()=>{
		const component = renderer.create(<Search>Search</Search>);
		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});


});

describe('Button',()=>{


	it('render without crashing', ()=>{

		const div = document.createElement('div');
		ReactDOM.render(<Button>Give me More</Button>, div);
		ReactDOM.unmountComponentAtNode(div);

	});

	test('has a valid snapshot',()=>{

		const component = renderer.create(<Button>Give me more</Button>);
		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();

	});



});

describe('Table', ()=>{

	const props = {
		list: [ {title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y'},
				{title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z'},
		],
	};

	it('render without crashing', ()=>{
		const div = document.createElement('div');
		ReactDOM.render(<Table {...props}/>, div);
		ReactDOM.unmountComponentAtNode(div);
	});

	test('has a valid snapshot',()=>{
		const component = renderer.create(<Table { ...props}/>);
		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();

	});


});





