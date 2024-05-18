import math

SECRET_KEY = "ec687d9dc385d79184910e7ec76e9712bfe0f31de7e62cc135df865b8d9827c0"
ALGORITHM = "HS256"

def create_pages(data, group_size):
    total_pages = math.ceil(len(data) / group_size)
    for i in range(total_pages):
        start_index = i * group_size
        end_index = min((i + 1) * group_size, len(data))
        yield data[start_index:end_index]

def get_page_content(data, page_number, group_size):
    total_pages = math.ceil(len(data) / group_size)
    if page_number <= 0 or page_number > total_pages:
        return []
    else:
        return list(create_pages(data, group_size))[page_number - 1]

def calculate_total_pages(total_items, group_size):
    return math.ceil(total_items / group_size)

def convert_level(level : int):
    match level:
        case 0:
            return "info"
        case 1:
            return "debug"
        case 2:
            return "success"
        case 3:
            return "warning"
        case 4:
            return "error"