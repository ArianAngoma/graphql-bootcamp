/* Demo user data */
const users = [
    {
        id: '1',
        name: 'Arian',
        email: 'arian.angoma.js@gmail.com',
        age: 21
    },
    {
        id: '2',
        name: 'Andrea',
        email: 'andrea@gmail.com',
    },
    {
        id: '3',
        name: 'Israel',
        email: 'israel@gmail.com',
    }
];

/* Demo post data */
const posts = [
    {
        id: '1',
        title: 'GraphQL',
        body: 'GraphQL course',
        published: true,
        author: '1'
    },
    {
        id: '2',
        title: 'NodeJS',
        body: 'NodeJS course',
        published: true,
        author: '1'
    },
    {
        id: '3',
        title: 'ExpressJS',
        body: 'ExpressJS course',
        published: false,
        author: '3'
    }
]

/* Demo comment data */
const comments = [
    {
        id: '1',
        text: 'This worked well for me.',
        author: '1',
        post: '2'
    },
    {
        id: '2',
        text: 'Glad you enjoyed it.',
        author: '1',
        post: '3'
    },
    {
        id: '3',
        text: 'This did no work.',
        author: '2',
        post: '3'
    },
    {
        id: '4',
        text: 'Never mind. I got it to work.',
        author: '3',
        post: '1'
    }
]

const db = {users, posts, comments};

module.exports = db;