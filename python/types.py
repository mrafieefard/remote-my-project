class Type:
    type_name : str

    def __str__(self) -> str:
        self.type_name

class String(Type):
    type_name = "str"
    
class Integer(Type):
    type_name = "int"

class List(Type):
    type_name = "list"

class Dict(Type):
    type_name = "dict"

class Log:
    INFO = 0
    DEBUG = 1
    SUCCESS = 2
    WARNING = 3
    ERROR = 4