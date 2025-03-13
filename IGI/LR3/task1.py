from tabulate import tabulate

import inputValidate

DESCRIPTION = """Write a program to calculate the value of the function 1 / (1 - x)
    using its power series expansion: 1 / (1 - x) = 0∑N x^n"""
MAX_INTERATION = 500
TITLE_TABLE = ["x", "n", "F(x)", "Math F(x)", "eps"]


def get_validate_inputs():
    """Function to receive input from the user"""
    eps = inputValidate.input_data_with_random("Input positive value for eps: ",
                                               float, 0, is_generate_random=True)
    x = inputValidate.input_data_with_random("Input argument func, where |x| < 1: ",
                                             float, -0.9999999999999999, 0.9999999999999999, is_generate_random=True)

    return eps, x


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

    return count_interation, fx, math_fx


def print_table(x, count_interation, fx, math_fx, eps):
    """Function for outputting results in a table"""
    value_table = [[x, count_interation, fx, math_fx, eps]]
    print(tabulate(value_table, headers=TITLE_TABLE, tablefmt="grid", floatfmt=".10f"))


def print_description():
    """Function for describing the task condition"""
    print(DESCRIPTION, end="\n\n")


def task1():
    """The main function to start the whole process"""
    print_description()
    eps, x = get_validate_inputs()
    count_interation, fx, math_fx = calculate(eps, x)
    print_table(x, count_interation, fx, math_fx, eps)
