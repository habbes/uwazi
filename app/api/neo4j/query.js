import driver from './driver';

export default (query, params) => {
  let session = driver.session();
  return session.run(query, params)
  .then((response) => {
    session.close();
    let notifications = response.summary.notifications || [];
    notifications.forEach((n) => {
      console.log(n);
    });
    return response;
  })
  .catch((error) => {
    session.close();
    return Promise.reject(error);
  });
};
