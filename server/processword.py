from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
import nltk

class ProcessWords:
    """Process words"""

    def __init__(self, word: str):
        self.word = word

    def processwords(self):
        """Process word"""

        sent = word_tokenize(self.word)

        return sent
