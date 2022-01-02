const Query = {
    async users(parent, args, {db, prisma}, info) {
        if (!args.query) return await prisma.user.findMany();

        return db.users.filter(user => {
            return user.name.toLowerCase().includes(args.query.toLowerCase());
        });
    },
    posts(parent, args, {db}, info) {
        if (!args.query) return db.posts;

        return db.posts.filter(post => {
            const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
            const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());

            return isTitleMatch || isBodyMatch;
        });
    },
    comments(parent, args, {db}, info) {
        if (!args.query) return db.comments;

        return db.comments.filter(comment => {
            return comment.text.toLowerCase().includes(args.query.toLowerCase());
        });
    },
    me() {
        return {
            id: '123123',
            name: 'Arian Angoma',
            email: 'arian.angoma.js@gmail.com',
            age: 21
        }
    },
    post() {
        return {
            id: '123123',
            title: 'GraphQL',
            body: 'Course GraphQL',
            published: true
        }
    }
}

module.exports = Query;