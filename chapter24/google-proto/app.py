import search_pb2
import binascii

search = search_pb2.SearchRequest()
search.keywords = 'Tony'
search.page = 31
search.items_per_page = 20
flag = search.IsInitialized()
print(flag)
serialized= search.SerializeToString()
print(serialized)
b_serialized = binascii.b2a_hex(serialized).decode()
print(b_serialized)
search.ParseFromString(serialized)
print(search)