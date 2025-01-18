import json

# Read the JSON file
with open("product_links.json", "r") as json_file:
    data = json.load(json_file)

# Remove duplicates by converting the list to a set (since sets don't allow duplicates)
unique_data = list(set(data))

# Write the unique data back to the JSON file
with open("product_links.json", "w") as json_file:
    json.dump(unique_data, json_file, indent=4)

print("Removed duplicates and saved the updated file.")
