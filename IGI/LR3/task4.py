# а) определить число слов, ограниченных пробелами
# б) определить, сколько раз повторяется каждая буква
# в) вывести по алфавиту словосочетания, отделенные запятыми

DESCRIPTION = """a) Determine the number of words delimited by spaces
b) Determine how many times each letter is repeated
c) List the phrases separated by commas in alphabetical order"""
CONST_STRING = (
    "So she was considering in her own mind, as well as she could, "
    "for the hot day made her feel very sleepy and stupid, "
    "whether the pleasure of making a daisy-chain "
    "would be worth the trouble of getting up "
    "and picking the daisies, "
    "when suddenly a White Rabbit with pink eyes ran close by her."
)


def count_words_in_text(text):
    """Function for counting the number of words in a text"""
    words = text.replace(',', '').replace('.', '').split()

    return len(words)


def count_letter_repeatability(text):
    """Function to count the frequency of each letter in the text"""
    letter_dict = {letter: 0 for letter in "abcdefghijklmnopqrstuvwxyz" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"}

    for character in text:
        if character.isalpha():
            letter_dict[character] += 1

    return letter_dict


def sort_phrases_in_text(text):
    """Function for sorting words in each phrase of text"""
    phrases = text.lower().replace('.', '').split(", ")

    # for i in range(len(phrases)):
    #     sorted_words = sorted(phrases[i].split())
    #     phrases[i] = ' '.join(sorted_words)
    phrases = sorted(phrases)
    return  phrases


def print_description():
    """Function for describing the task condition"""
    print(DESCRIPTION, end="\n\n")


def task4():
    """The main function to start the whole process"""
    print_description()

    # ---------------------------------- a --------------------------------------------------------
    word_count = count_words_in_text(CONST_STRING)
    print("a) Count words in the text:", word_count, "\n")

    # ---------------------------------- b --------------------------------------------------------
    letter_dict = count_letter_repeatability(CONST_STRING)
    print("b) Repeatability of each letter:", letter_dict, "\n")

    # ---------------------------------- c --------------------------------------------------------
    sorted_phrases = sort_phrases_in_text(CONST_STRING)
    print("c) Sorted phrases:", sorted_phrases)
