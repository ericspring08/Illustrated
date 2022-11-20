from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
import nltk
import numpy as np
import pandas as pd
import re
from sklearn.metrics.pairwise import cosine_similarity
import networkx as nx
import gzip
import requests
import os

class ProcessWords:
    """Process words"""

    def __init__(self, word: str):
        self.word = word
        self.sent = sent_tokenize(self.word)
        self.stopwords = stopwords.words('english')

    def processwords(self):
        """Process word"""

        ranked_sentences = self.rankwords()
        
        num_of_sentences = round(len(ranked_sentences)/4)

        images = []

        for i in range(num_of_sentences):
            image = self.generate_image(ranked_sentences[i][1])
            self.sent.insert(self.sent.index(ranked_sentences[i][1]), "data:image/png;base64," + str(image))

        return self.sent
        return ranked_sentences

    def rankwords(self):
        """Rank words"""

        self.extractwordvectors()

        sentence_vectors = []
        for i in self.sent:
            if len(i) != 0:
                v = sum([self.word_embeddings.get(w, np.zeros((50,))) for w in i.split()])/(len(i.split())+0.001)
            else:
                v = np.zeros((50,))
            sentence_vectors.append(v)

        # similarity matrix
        sim_mat = np.zeros([len(self.sent), len(self.sent)])

        for i in range(len(self.sent)):
          for j in range(len(self.sent)):
            if i != j:
              sim_mat[i][j] = cosine_similarity(sentence_vectors[i].reshape(1,50), sentence_vectors[j].reshape(1,50))[0,0]

        nx_graph = nx.from_numpy_array(sim_mat)
        scores = nx.pagerank(nx_graph)

        ranked_sentences = sorted(((scores[i],s) for i,s in enumerate(self.sent)), reverse=True) 

        return ranked_sentences

    def remove_stopwords(self):
        sen_new = " ".join([i for i in self.sent if i not in self.stopwords])
        return sen_new
        
    def extractwordvectors(self):
        self.word_embeddings = {}
        f = gzip.open('./textdata.txt.gz', 'rt', encoding='utf-8')
        for line in f:
            values = line.split()
            word = values[0]
            coefs = np.asarray(values[1:], dtype='float32')
            self.word_embeddings[word] = coefs
        f.close()

    def generate_image(self, sentence):
        """Generate image"""

        res = requests.post(f'http://7a66-35-236-207-203.ngrok.io/generateimage', data={'sentences': sentence})

        return res.json().get('image')
