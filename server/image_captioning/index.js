// const { spawn } = require('child_process');
// const temperatures = []; // Store readings

// const sensor = spawn('python', ['sensor.py']);
// sensor.stdout.on('data', function(data) {

//     // convert Buffer object to Float
//     temperatures.push(parseFloat(data));
//     console.log(temperatures);
// });
const { URL, URLSearchParams } = require('url');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
// const url = "https://images.unsplash.com/photo-1587405254461-abd1d1c7440e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80";
// fetch('http://127.0.0.1:5000/img_captioning?' + new URLSearchParams({
//         url: url,
//     }))
//     .then(response => response.json())
//     .then(data => console.log(data));

// const url = encodeURIComponent("https://images.unsplash.com/photo-1587405254461-abd1d1c7440e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80");
// // const url = "hey";
// fetch(`http://127.0.0.1:5000/img_captioning?img_url=${url}`)
//     .then(response => response.json())
//     .then(data => console.log(data));

const text = 'A cat is riding a bicycle'
fetch(`http://127.0.0.1:5000/get_keywords?text=${text}`)
    .then(response => response.json())
    .then(data => console.log(data));