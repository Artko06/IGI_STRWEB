import time

import inputValidate
import task1
import task2
import task3
import task4
import task5


# ---------------------------------------------------------
# Lab Work №3
# Topic: Standard Data Types, Collections, Functions, Modules
# Goal: Master the basic syntax of Python, gain skills working with standard data types,
# collections, functions, modules, and reinforce them by developing interactive applications.
# Version: 1.0
# Developer: Kokhan Artyom
# Date of Development: 12.03.2025
# ---------------------------------------------------------

def log_task_execution(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()  # Засекаем время начала выполнения
        print(f"Запуск задачи: {func.__name__}")
        result = func(*args, **kwargs)
        end_time = time.time()  # Засекаем время окончания выполнения
        print(f"Задача {func.__name__} выполнена за {end_time - start_time:.4f} секунд.")
        return result

    return wrapper


@log_task_execution
def run_task1():
    task1.task1()


@log_task_execution
def run_task2():
    task2.task2()


@log_task_execution
def run_task3():
    task3.task3()


@log_task_execution
def run_task4():
    task4.task4()


@log_task_execution
def run_task5():
    task5.task5()


while True:
    print("\n1. Run task1\n2. Run task2\n3. Run task3\n4. Run task4\n5. Run task5\n0. Exit\n")

    select = inputValidate.input_data("Input number of task: ", int, 0, 5)

    if select == 1:
        run_task1()
    elif select == 2:
        run_task2()
    elif select == 3:
        run_task3()
    elif select == 4:
        run_task4()
    elif select == 5:
        run_task5()
    else:
        break
