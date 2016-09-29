import url from './url';
import request from 'superagent-bluebird-promise';


export function postRequest(data, serviceName, success, fail) {
  const uuid = localStorage.getItem('uuid');
  const params = {
    data,
    service: serviceName,
    uuid,
    timestamp: '',
    signatures: '',
  };
  return request.post(url.webapp)
  .withCredentials()
  .send(params)
  .then((res) => {
    const returnData = JSON.parse(res.text);
    if (returnData.success) {
      success(returnData);
    } else {
      fail(returnData);
    }
  });
}
