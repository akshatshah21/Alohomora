const imageCaption = async (imageUrl) => {
  return new Promise(async (resolve, reject) => {
    console.log("inside image caption");
    let words = [];
    try {
      fetch(`http://localhost:5000/img_captioning?img_url=${imageUrl}`, {
        'method': 'GET',
        headers: {
          'Content-Type'
            : 'application/json'
        },
      }).then(data => data.json())
      .then(async (res) => {
        console.log("res:", res);
          console.log("preds:",res.preds);
          let text = res.preds[0];
          fetch(`http://localhost:5000/get_keywords?text=${text}`, {
            'method': 'GET',
            headers: {
              'Content-Type'
                : 'application/json'
            },
          }).then(keywordData => keywordData.json())
          .then((response) => {

              words = response.words;
              for (var i = 0; i < words.length; i++) {
                text = text.replace(words[i], "_______");
              }
              console.log(text);
              resolve({ text: text });
          })
      })
    } catch (err) { }
  });
};

export default imageCaption;