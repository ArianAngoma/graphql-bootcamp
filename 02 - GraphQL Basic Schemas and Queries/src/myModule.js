const message = 'Some message from myModule.js';
const name = 'Arian';

const location = 'Perú';

const getGreeting = (name) => `Welcome ${name}`;

export {
    message,
    name,
    getGreeting,
    location as default
}


