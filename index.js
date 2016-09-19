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

const list = blessed.list({
    top: '0',
    left: '0',
    width: '50%',
    height: '50%',
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
    keys: true
});

r.getHot().map(submissionToListablePost).then(list.setItems.bind(list));

function submissionToListablePost(submission) {
    return [`[${submission.id}]`, submission.title, `(by /u/${submission.author.name})`].join(' ');
}


screen.append(list);

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

// Focus our element.
list.focus();

// Render the screen.
screen.render();