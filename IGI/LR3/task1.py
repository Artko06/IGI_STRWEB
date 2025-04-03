from tabulate import tabulate

import inputValidate

DESCRIPTION = """Write a program to calculate the value of the function 1 / (1 - x)
    using its power series expansion: 1 / (1 - x) = 0∑N x^n"""
MAX_INTERATION = 500
TITLE_TABLE = ["x", "n", "F(x)", "Math F(x)", "eps"]


def print_description():
    """Function for describing the task condition"""
    print(DESCRIPTION, end="\n\n")


def print_table(func):
    """Function for outputting results in a table"""
    def wrapper_in_table(*args, **kwargs):
        result = func(*args, **kwargs)
        print(tabulate([result], headers=TITLE_TABLE, tablefmt="grid", floatfmt=".10f"))

        return result

    return wrapper_in_table


def get_validate_inputs():
    """Function to receive input from the user"""
    eps = inputValidate.input_data_with_random("Input value from 0 to 1 for eps: ",
                                               float, 0, 0.999, is_generate_random=True)
    x = inputValidate.input_data_with_random("Input argument func, where |x| < 1: ",
                                             float, -0.9999999999999999, 0.9999999999999999, is_generate_random=True)

    return eps, x

@print_table
def calculate(eps, x):
    """Function for calculating the sum of a series until a specified accuracy is reached"""
    math_fx = 1 / (1 - x)
    term = 1  # init first term of series(x^0)
    fx = term  # start value: x^0 = 1
    count_interation = 1

    while count_interation < MAX_INTERATION and abs(term) > eps:
        count_interation += 1
        term *= x  # now member of series
        fx += term

    return x, count_interation, fx, math_fx, eps


def task1():
    """The main function to start the whole process"""
    print_description()
    eps, x = get_validate_inputs()
    calculate(eps, x)
