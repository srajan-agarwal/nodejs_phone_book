import server from './server';

const port = parseInt('4000');

const starter = new server().start(port)
  .then(port => console.log(`Running on port ${port}`))
  .catch(error => {
    console.error(error)
  });

export default starter;