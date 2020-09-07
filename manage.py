#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tweetme2.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(

            "COULDN'T IMPORT DJANGO. ARE YOU SURE IT'S INSTALLED AND "
            "AVAILABLE ON YOUR PYTHONPATH ENVIRONMENT VARIABLE? DID YOU "
            "FORGET TO ACTIVATE A VIRTUAL ENVIRONMENT?"

        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
