function getRequestObject() {
    var request = {
        status: true,
        noOfRequest: 0,
        url: '',
        method: '',
        header: "",
        body: ""
    };
    var send_button_el = document.getElementById("send_button");
    var no_of_request_el = document.getElementById("no_of_request");
    var url_el = document.getElementById("url");
    var get_el = document.getElementById("get");
    var post_el = document.getElementById("post");
    var methods = document.getElementsByName('method');
    var method = '';
    var header_el = document.getElementById("header");
    var body_el = document.getElementById("body");

    if (!no_of_request_el.value) {
        alert("No of request can't be empty!");
        request.status = false;
    } else {
        request.noOfRequest = no_of_request_el.value;
    }
    if (!url_el.value) {
        alert("URL can't be empty!");
        request.status = false;
    } else {
        request.url = url_el.value;
    }
    for (var i = 0, length = methods.length; i < length; i++) {
        if (methods[i].checked) {
            method = methods[i].value;
            break;
        }
    }
    if (!method) {
        alert("Method can't be unselected!");
        request.status = false;
    } else {
        request.method = method;
        request.header = header_el.value;
        if (method === 'POST' && !body_el.value) {
            alert("Body can't be empty!");
            request.status = false;
        } else {
            request.body = body_el.value;
        }
    }
    return request;
}


function makeGetRequest(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        // xhr.setRequestHeader("Access-Control-Allow-Origin", "'*'");

        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.responseText);
            } else {
                reject("Request failed with status: " + xhr.status);
            }
        };

        xhr.onerror = function () {
            reject("Network error occurred");
        };

        xhr.send();
    });
}


function makeRequest(url, method, header, body) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        // xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        setHeaders(header, xhr);

        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject("Request failed with status: " + xhr.status);
            }
        };

        xhr.onerror = function () {
            reject("Network error occurred");
        };
        if (method === 'POST') {
            xhr.send(body);
        } else {
            xhr.send();
        }
    });
}


var url = "https://jsonplaceholder.typicode.com/posts"; // Replace with your endpoint URL
var data = JSON.stringify({
    title: 'ABIR',
    body: 'SHAFAYET',
    userId: 1,
});



function sendConcurrentRequest() {
    var requestObj = getRequestObject();
    if (requestObj.status) {
        var start_time_element = document.getElementById("start_time");
        var end_time_element = document.getElementById("end_time");
        var req_no_element = document.getElementById("req_no");
        var time_diff_element = document.getElementById("time_diff");
        var req_url_element = document.getElementById("req_url");
        var req_header_element = document.getElementById("req_header");
        var req_body_element = document.getElementById("req_body");
        var req_response_element = document.getElementById("req_response");

        start_time_element.innerHTML = "";
        end_time_element.innerHTML = "";
        req_no_element.innerHTML = "";
        time_diff_element.innerHTML = "";
        req_url_element.innerHTML = "";
        req_header_element.innerHTML = "";
        req_body_element.innerHTML = "";
        req_response_element.innerHTML = "";


        var no_of_request = parseInt(requestObj.noOfRequest);
        console.log("No Of Request: " + no_of_request);
        // req_no_element.innerHTML = "No Of Request: " + no_of_request + ", <br> URL: " + url;
        req_no_element.innerHTML = no_of_request;
        req_url_element.innerHTML = requestObj.url;
         req_header_element.innerHTML = requestObj.header;
         req_body_element.innerHTML = requestObj.body;
        
        // Number of concurrent requests
        var concurrency = no_of_request;

        var requests = [];

        // Create an array of promises for concurrent requests
        var start_time = Date.now();
        var start_time_str = getTimeFromTimeStamp(start_time);
        console.log(start_time_str);
        start_time_element.innerHTML = start_time_str;


        for (var i = 0; i < concurrency; i++) {
            requests.push(makeRequest(requestObj.url, requestObj.method, requestObj.header, requestObj.body));
        }

        // Send all requests concurrently and handle responses
        Promise.all(requests)
            .then(function (responses) {
                console.log("All requests completed successfully:", responses);
                var end_time = Date.now();
                var end_time_str = getTimeFromTimeStamp(end_time);
                console.log(end_time_str);
                end_time_element.innerHTML = end_time_str;
                getTimeDifferenceSecoends(start_time, end_time);
                // req_response_element.innerHTML = "All requests completed successfully: <br>"+ responses;
                 req_response_element.innerHTML  =JSON.stringify(responses, undefined, 2);
            })
            .catch(function (error) {
                console.error("At least one request failed:", error);
                req_response_element.innerHTML += "<br>"+ error;
            });
    }
}

function getTimeFromTimeStamp(timestamp) {
    const date = new Date(timestamp);
    var time = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    return time;
}

function getTimeDifferenceSecoends(start_time, end_time) {
    var time_diff_element = document.getElementById("time_diff");
    var date1 = new Date(start_time);
    var date2 = new Date(end_time);
    var timeDifference = date2 - date1;

    // Calculate the time difference in seconds
    var secondsDifference = timeDifference / 1000;

    var time_diff_str = secondsDifference +" (sec)";
    console.log("Time difference in seconds: " +time_diff_str);
    time_diff_element.innerHTML = time_diff_str;

    return secondsDifference;
}

function setHeaders(headers, xhr) {
    var header = JSON.stringify(headers);
    for (let key in header) {
        xhr.setRequestHeader(key, header[key]);
    }
}
//   setHeaders({'Host':'api.domain.com','X-Requested-With':'XMLHttpRequest','Content-type', 'application/json; charset=UTF-8'})