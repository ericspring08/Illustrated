from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
import nltk

class ProcessWords:
    """Process words"""

    def __init__(self, word: str) -> None:
        self.word = word

    def processwords(self) -> list[str]:
        """Process word"""

        sent = word_tokenize(self.word)

        return sent
