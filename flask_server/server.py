# Image Captioning
import torch
import requests
from PIL import Image
from transformers import ViTFeatureExtractor, AutoTokenizer, VisionEncoderDecoderModel
import spacy
from collections import Counter
from string import punctuation


loc = "ydshieh/vit-gpt2-coco-en"

feature_extractor = ViTFeatureExtractor.from_pretrained(loc)
tokenizer = AutoTokenizer.from_pretrained(loc)
model = VisionEncoderDecoderModel.from_pretrained(loc)
model.eval()

nlp = spacy.load("en_core_web_sm")

def predict(image):

    pixel_values = feature_extractor(images=image, return_tensors="pt").pixel_values

    with torch.no_grad():
        output_ids = model.generate(pixel_values, max_length=16, num_beams=4, return_dict_in_generate=True).sequences

    preds = tokenizer.batch_decode(output_ids, skip_special_tokens=True)
    preds = [pred.strip() for pred in preds]

    return preds

# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import Flask
from flask import jsonify, request
  
# Flask constructor takes the name of 
# current module (__name__) as argument.
app = Flask(__name__)
from flask_cors import CORS
cors = CORS(app)

  
# The route() function of the Flask class is a decorator, 
# which tells the application which URL should call 
# the associated function.
@app.route('/img_captioning')
# ‘/’ URL is bound with hello_world() function.
def hello_world():
    # img_url = request.args.get('url')
    args = request.args.to_dict()

    with Image.open(requests.get(args['img_url'], stream=True).raw) as image:
        preds = predict(image)
    
    

    return jsonify(
        preds=preds,
    )


@app.route('/get_keywords')
# ‘/’ URL is bound with hello_world() function.
def get_hotwords():

    text = request.args.to_dict()['text']
    
    result = []
    pos_tag = ['PROPN', 'ADJ', 'NOUN'] # 1
    doc = nlp(text.lower()) # 2
    for token in doc:
        # 3
        if(token.text in nlp.Defaults.stop_words or token.text in punctuation):
            continue
        # 4
        if(token.pos_ in pos_tag):
            result.append(token.text)

    return {'words' : result} # 5


# main driver function
if __name__ == '__main__':
  
    # run() method of Flask class runs the application 
    # on the local development server.
    app.run(debug=True)