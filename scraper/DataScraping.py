from bs4 import BeautifulSoup
import requests
import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

#options = webdriver.ChromeOptions()
#service = Service(executable_path="./chromedriver.exe")
options = webdriver.ChromeOptions()
options.add_argument("--disable-gpu")
driver = webdriver.Chrome(options=options)

header = {'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36'
}
baseurl = 'https://www.sephora.sg'
productlinks = []
# for x in range(1,24):
#     r = requests.get(f'https://www.sephora.sg/categories/fragrance/women?page={x}')
#     soup = BeautifulSoup(r.content, 'html.parser')
#     links = soup.find_all('a')

#     for link in links:
#         product = link.get('href')
#         split_link = product.split("/")
#         if split_link[1] == "products":
#             productlinks.append(baseurl + product)
            
with open("product_links.json", "r") as json_file:
    product_links = json.load(json_file)



print(f"Saved {len(product_links)} product links to product_links.json")

# Set up Selenium WebDriver
driver = webdriver.Chrome()  # Ensure chromedriver is in PATH
product_links = product_links[300:]
with open("product_data.json", "a") as json_file:
    action = webdriver.ActionChains(driver)
    for link in product_links:
        action.pause(3)
        action.perform()
        print(link)
        driver.get(link)

        # Find the h1 element
        name = driver.find_element(By.CSS_SELECTOR, "h1[data-v-2cede974]").text
        print(name)
        wait = WebDriverWait(driver, 10)

        # fragrance = driver.find_element(By.CLASS_NAME,"product-filter-values")
        fragrance = driver.find_element(By.CSS_SELECTOR, "span[data-v-9cb5d14e].product-filter-values").text
        print(fragrance)


        product_data = {
            "name": name,
            "fragrance": fragrance
        }


        json.dump(product_data, json_file, indent=4)
        json_file.write("\n,")  # Write a newline to separate
        action.pause(3)
        



# # Write the list of product data to a JSON file
# with open("product_data.json", "w") as json_file:
#     json.dump(big_dict, json_file, indent=4)

# Close the browser
driver.close()
driver.quit()

# # div = soup.find_all("data-v-2cede974")
# div = soup.find_all(class_ = 'product-heading',attrs={"data-v-2cede974": ""})
# print(div)


# div = soup.find('div', class_ = "main_body")
# print(div.find_all('h1'))
# for h1 in soup.find_all('div', class_ = "row product-show"):
#     print(h1)
# print(soup.find('span', class_ = "product-filter-types"))




# r = requests.get(f"https://www.sephora.sg/categories/fragrance/women?page={2}")
# soup = BeautifulSoup(r.content, 'html.parser')
# links = soup.find_all('a')
# productlinks = []
# for link in links:
#     product = link.get('href')
#     split_link = product.split("/")
#     if split_link[1] == "products":
#         productlinks.append(baseurl + product)
#         print(productlinks)

# product_links = links.get('href')
# print(product_links)
# product_list = soup.find_all('div', class_ = 'brand')
# #/html/body/div[1]/div/div/main/div[2]/div/div[3]/div[3]/div[1]/div/div/div/div/div/div/div[1]/div/div/div/div/div/a
# #/html/body/div[1]/div/div/main/div[2]/div/div[3]/div[3]/div[1]/div/div/div/div/div/div/div[2]/div/div/div/div/div/a
# print(product_list)