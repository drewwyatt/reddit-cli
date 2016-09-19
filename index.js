const blessed = require('blessed');
const snoowrap = require('snoowrap');
const config = require('./config.json');

const r = new snoowrap({
    userAgent: 'User-Agent: console:reddit-cli:v0.1.0 (by /u/drewwyatt)',
    accessToken: config.accessToken
});

// {
//     "scope": "account read report save submit subscribe vote"
// }

// Create a screen object.
const screen = blessed.screen({
    smartCSR: true
});

screen.title = 'reddit-cli';

function onSelect(box, screen) {
	return function(something) {
		box.setContent('boom');
		screen.render();
	}
}

const box = blessed.box({
	top: '0',
    right: '0',
    width: '50%',
    height: '100%',
    style: {
        // fg: 'white',
        // bg: 'magenta',
        border: {
            fg: '#f0f0f0'
        }
    },
	content: 'Post content here.'
});


const list = blessed.list({
    top: '0',
    left: '0',
    width: '50%',
    height: '100%',
    style: {
        // fg: 'white',
        // bg: 'magenta',
        border: {
            fg: '#f0f0f0'
        },
        item: {
            hover: {
                bg: 'blue'
            }
        },
        selected: {
            bg: 'blue',
            bold: true
        }
    },
    keys: true,
	content: 'Fetching submissions...'
});

var itemMap = [];

list.on('select', function(el, selected) {
	const id = el.getText().split(':')[0];
	// const foo = itemMap.find(i => i.id === id);
	box.setContent(JSON.stringify(itemMap));
	screen.render();
})

screen.append(list);
screen.append(box);

r.getHot().map(submissionToListablePost).then(setItems).then(updateList(list, screen));

function setItems(items) {
	itemMap = items;
	return Promise.resolve(items);
}

function updateList(list, screen) {
	return function (items) {
		list.setItems(items);
		screen.render();
	}
}

function submissionToListablePost(submission) {
    return [`${submission.id}:`, submission.title, `(by /u/${submission.author.name})`].join(' ');
}

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

// Focus our element.
list.focus();

// Render the screen.
screen.render();