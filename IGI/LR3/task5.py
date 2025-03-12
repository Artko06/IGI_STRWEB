# а) Найти минимальный положительный элемент списка
# b) Найти сумму элементов списка, расположенных между первым и последним положительными элементами

import inputValidate

DESCRIPTION = """a) Find useful positive elements of the list
b) Find the composition of the list located between the first and last elements of the elements"""


def get_numbers():
    """Function to get numbers from user"""
    list_numbers = []

    while True:
        num = inputValidate.input_data_with_random("Input float num or 0 for finishing input: ", float,
                                                   is_generate_random=True, is_printing_generate_value=True)
        if num != 0:
            list_numbers.append(num)
        else:
            break

    return list_numbers


def find_first_and_last_positive(numbers):
    """Function to find the indices of the first and last positive number"""
    index_first_positive = -1
    index_last_positive = -1

    for index in range(len(numbers)):
        if numbers[index] > 0:
            if index_first_positive == -1:
                index_first_positive = index
            index_last_positive = index

    return index_first_positive, index_last_positive


def find_min_positive(numbers):
    """Function to find the minimum positive number in a list"""
    return min(num for num in numbers if num > 0)


def calculate_sum_between_first_and_last_positive(numbers, index_first_positive, index_last_positive):
    """Function to calculate the sum of elements between the first and last positive number"""
    if index_first_positive != index_last_positive:
        return sum(numbers[index_first_positive + 1:index_last_positive])
    else:
        return None


def print_description():
    """Function for describing the task condition"""
    print(DESCRIPTION, end="\n\n")


def task5():
    """The main function to start the whole process"""
    print_description()

    list_numbers = get_numbers()

    if list_numbers:
        index_first_positive, index_last_positive = find_first_and_last_positive(list_numbers)

        if index_first_positive != -1:
            print("Min positive number:", find_min_positive(list_numbers))

            sum_between = calculate_sum_between_first_and_last_positive(
                list_numbers, index_first_positive, index_last_positive
            )

            if sum_between is not None:
                print("Sum between first and last positive number:", sum_between)
            else:
                print("No elements between the first and last positive number")

        else:
            print("All numbers are negative")

    else:
        print("The list is empty")
