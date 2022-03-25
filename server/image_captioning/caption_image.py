import torch
import requests
from PIL import Image
from transformers import ViTFeatureExtractor, AutoTokenizer, VisionEncoderDecoderModel


loc = "ydshieh/vit-gpt2-coco-en"

feature_extractor = ViTFeatureExtractor.from_pretrained(loc)
tokenizer = AutoTokenizer.from_pretrained(loc)
model = VisionEncoderDecoderModel.from_pretrained(loc)
model.eval()


def predict(image):

    pixel_values = feature_extractor(images=image, return_tensors="pt").pixel_values

    with torch.no_grad():
        output_ids = model.generate(pixel_values, max_length=16, num_beams=4, return_dict_in_generate=True).sequences

    preds = tokenizer.batch_decode(output_ids, skip_special_tokens=True)
    preds = [pred.strip() for pred in preds]

    return preds


# We will verify our results on an image of cute cats
# url = "http://images.cocodataset.org/val2017/000000039769.jpg"
url = "https://images.unsplash.com/photo-1587405254461-abd1d1c7440e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
with Image.open(requests.get(url, stream=True).raw) as image:
    preds = predict(image)

print(preds)
# should produce
# ['a cat laying on top of a couch next to another cat']