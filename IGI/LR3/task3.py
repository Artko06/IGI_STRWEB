import inputValidate

DESCRIPTION = """In a line entered from the keyboard, 
    count the number of characters lying in the range from 'g' to 'o'"""


def get_input_string():
    """Function to get a string from the user"""
    return inputValidate.input_data_with_random("Input string: ", str,
                                                is_generate_random=True,
                                                is_printing_generate_value=True)  # g, h, i, j, k, l, m, n, o


def count_characters_in_range(string_value):
    """Function to count characters in a string in a given range from 'g' to 'o'"""
    count_characters = 0

    for character in string_value:
        if 'g' <= character <= 'o':
            count_characters += 1

    return count_characters


def print_result(count_characters):
    """Function to display the result"""
    print(f"Count characters in range from 'g' before 'o': {count_characters}")


def print_description():
    """Function for describing the task condition"""
    print(DESCRIPTION, end="\n\n")


def task3():
    """The main function to start the whole process"""
    print_description()
    string_value = get_input_string()
    count_characters = count_characters_in_range(string_value)
    print_result(count_characters)
