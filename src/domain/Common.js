const domainCommon = {
    fetch: (url, resolve, reject, method, jsonBody) => {
        let options = method ? {method} : {};
        options = jsonBody ? Object.assign(options, {body: JSON.stringify(jsonBody)}) : options;

        // set apiTokenHeader if available
        options.headers = Object.assign({
            'Accept': 'application/json',
            'AccountKey': 'your-account-key-here'
        });

        console.log("URL: "+ url ,options);

        return fetch(url, options).then((response) => {
            if (check2XXStatus(response.status)) {
                if (response.status == 204)
                    resolve({});
                else {
                    let data = response.json();
                    // console.log("RESPONSE: ", data);
                    resolve(data.catch(()=> {
                        return {}
                    }));
                }
            }
            else {
                response.json().then(function (data) {
                    reject({...data, status: response.status});
                }).catch(function () {
                    reject({status: response.status}); //avoid response data can't serialization to json
                });
            }
        }).catch((err) => {
            // console.log("ERROR: ", err);
            reject(err);
        });
    },
    fetchPost: (url, jsonObj, resolve, reject) => {
        return domainCommon.fetch(url, resolve, reject, 'POST', jsonObj);
    }, fetchPut: (url, jsonObj, resolve, reject) => {
        return domainCommon.fetch(url, resolve, reject, 'PUT', jsonObj);
    }, fetchDelete: (url, resolve, reject, jsonObj) => {
        return domainCommon.fetch(url, resolve, reject, 'DELETE', jsonObj);
    },
}

function check2XXStatus(status) {
    return status >= 200 && status < 300;
};

export default domainCommon;