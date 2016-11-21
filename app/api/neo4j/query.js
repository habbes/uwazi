import driver from './driver';

export default (query) => {
  let session = driver.session();
  return session.run(query)
  .then((response) => {
    session.close();
    return response;
  })
  .catch((error) => {
    session.close();
    return Promise.reject(error);
  });
};
