from flask import Flask,request,jsonify
from underthesea import sentiment,word_tokenize
app = Flask("BKService")
MAX_SCORE = 10
AVG = 7
MIN_SCORE = 5

@app.route('/', methods=['POST'])
def index():
    data = request.json['text']
    return {"np": calScore(data)}

def countingNP(text):
    words = word_tokenize(text)
    res = [0,0,0,0]
    for i in words:
        if sentiment(i) == 'positive':
            res[0] = res[0] + 1
        elif sentiment(i) == 'negative':
            res[1] = res[1] + 1
        else:
            res[2] = res[2] + 1
    res[3] = len(words)
    return res

def calScore(text):
    npMulti = countingNP(text) # 0: positive, 1: negative, 2: null, 3: num of words
    npTotal = sentiment(text)
    if npMulti[3] <= 0 : return MIN_SCORE
    npTotal = 1 if (npTotal == 'positive') else (-1 if npTotal == 'negative' else 0)
    print(npMulti, npTotal)
    if npTotal == 1:
        return MAX_SCORE - npMulti[1]*5/npMulti[3]
    elif npTotal == -1:
        return MIN_SCORE + npMulti[0]*5/npMulti[3]
    else:
        if npMulti[0]>0 and npMulti[1]>0:
            if npMulti[0]>npMulti[1]: return AVG + 3*(npMulti[0]-npMulti[1])/npMulti[0]
            else: return AVG - 3*(npMulti[1]-npMulti[0])/npMulti[1]
    return AVG
