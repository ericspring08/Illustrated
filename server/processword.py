from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
import nltk
import numpy as np
import pandas as pd
import re
from sklearn.metrics.pairwise import cosine_similarity
import networkx as nx
import gzip

class ProcessWords:
    """Process words"""

    def __init__(self, word: str):
        self.word = word
        self.sent = sent_tokenize(self.word)
        self.stopwords = stopwords.words('english')

    def processwords(self):
        """Process word"""

        ranked_sentences = self.rankwords()

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
