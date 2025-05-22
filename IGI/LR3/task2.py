import inputValidate

DESCRIPTION = """Create a loop that takes integers and calculates the largest of them.
    The loop ends when the number 0 is entered"""


def get_numbers():
    """Function to get numbers from user"""
    list_numbers = []

    while True:
        num = inputValidate.input_data_with_random("Input integer num or 0 for finishing input: ", int,
                                                   is_generate_random=True, is_printing_generate_value=True)
        if num != 0:
            list_numbers.append(num)
        else:
            break

    return list_numbers


def print_max_number(numbers):
    """Function to display the result"""
    if numbers:
        print(f"The largest number entered is: {max(numbers)}")
    else:
        print("The list is empty")


def print_description():
    """Function for describing the task condition"""
    print(DESCRIPTION, end="\n\n")


def task2():
    """The main function to start the whole process"""
    print_description()
    numbers = get_numbers()
    print_max_number(numbers)
