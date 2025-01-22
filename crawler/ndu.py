from lxml import html
from urllib.parse import urljoin
import requests
import json
from bs4 import BeautifulSoup

universities = [
    {
        "baseUrl": "https://ndu.edu.pk",
        "body": {
            "name": {"type": "String", "path": {
                "select": 'National Defence University',
                "next": "direct"
            }},
            "image": {"type": "String", "path": {
                "select": '/html/body/div[1]/div[1]/div[2]/div[1]/center/img',
                "next": "select imageUrl"
            }},
            "logo": {"type": "String", "path": {
                "select": '/html/body/div[1]/div[1]/div[2]/div[1]/center/img',
                "next": "select imageUrl"
            }},
            "about": {"type": "String",
                      "path": {
                          "navigate": '/about-history.php/',
                          "select": '/html/body/center/div/div[4]/div/div[2]/div[2]',
                          "next": 'select text'
                      }
                      },
            "cover": {"type": "String", "path": {
                "select": '/html/body/div[1]/div[1]/div[2]/div[1]/center/img',
                "next": "select imageUrl"
            }},
            "contact": {
                "number": {"type": "String array", "path": {
                    "navigate": "/ndu_contacts.php/",
                    "next": "extract phone numbers"
                }},
                "email": {"type": "String array", "path": {
                    "navigate": "/ndu_contacts.php/",
                    "next": "extract email addresses"
                }},
                "website": {"type": "String", "select": "base url"},
            },
            "feeStructure": {
                "type": "key-value",
                "path": {
                    "navigate": "/fcs/fcs_fee.php/",
                    "select": '/html/body/center/div/div[4]/div[1]/div/div/table',
                    "next": "select"
                }
            }
        }
    }
]


def post_data_to_backend(url, data):
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        # Fetch all existing data from the backend
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            existing_data = response.json()
            # print("Fetched existing data:", existing_data)  # Debug print to inspect structure
            
            # Check for existing entries with the same 'name'
            for item in existing_data:
                # print("Inspecting item:", item)  # Debug each item
                
                # Check if 'name' and 'id' fields exist in each item
                if item.get('name') == data['name']:
                    if '_id' in item:
                        delete_url = f"{url}/{item['_id']}"
                        delete_response = requests.delete(delete_url, headers=headers)
                        
                        if delete_response.status_code == 200:
                            print(f"Deleted existing entry with id {item['_id']} successfully.")
                        else:
                            print(f"Failed to delete entry with id {item['_id']}. Status code: {delete_response.status_code}")
                            return
                    else:
                        print("Item does not contain 'id' key:", item)  # Debug if 'id' is missing
                        return
            else:
                print("No matching entries found with the same name.")

        else:
            print(f"Failed to fetch data. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return
        
        # Now, post the new data
        post_response = requests.post(url, headers=headers, data=json.dumps(data))

        if post_response.status_code == 200:
            print("Data posted successfully.")
        else:
            print(f"Failed to post data. Status code: {post_response.status_code}")
            print(f"Response: {post_response.text}")
    except Exception as e:
        print(f"An error occurred: {e}")


def extract_text(tree, xpath):
    element = tree.xpath(xpath)
    if element and isinstance(element, list):
        return element[0].text_content().strip()
    return None


def extract_image_url(tree, xpath, base_url):
    element = tree.xpath(xpath)
    if element and isinstance(element, list) and 'src' in element[0].attrib:
        return urljoin(base_url, element[0].attrib['src'])
    return None


def extract_contact_info(tree, info_type):
    if info_type == "phone":
        return tree.xpath('//a[contains(@href, "tel:")]/text()')
    elif info_type == "email":
        return tree.xpath('//a[contains(@href, "mailto:")]/text()')
    return []


def crawl_university(university):
    base_url = university["baseUrl"]
    body = university["body"]

    response = requests.get(base_url)
    tree = html.fromstring(response.content)

    name = ""
    if body["name"]["path"]["next"] == "direct":
        name = body["name"]["path"]["select"]
    else:
        name = extract_text(tree, body["name"]["path"]["select"])
    logo = extract_image_url(tree, body["logo"]["path"]["select"], base_url)
    cover = extract_image_url(tree, body["cover"]["path"]["select"], base_url)
    image = extract_image_url(tree, body["image"]["path"]["select"], base_url)

    about_page_url = urljoin(base_url, body["about"]["path"]["navigate"])
    about_response = requests.get(about_page_url)
    about_tree = html.fromstring(about_response.content)
    about = extract_text(about_tree, body["about"]["path"]["select"])
    
    contact_page_url = urljoin(base_url, body["contact"]["number"]["path"]["navigate"])
    contact_response = requests.get(contact_page_url)
    contact_tree = html.fromstring(contact_response.content)
    phone_numbers = extract_contact_info(contact_tree, "phone")
    emails = extract_contact_info(contact_tree, "email")

    fee_page_url = urljoin(base_url, body["feeStructure"]["path"]["navigate"])
    fee_response = requests.get(fee_page_url)
    fee_tree = html.fromstring(fee_response.content)
    fee_table = fee_tree.xpath(body["feeStructure"]["path"]["select"])

    result = {
        "name": name,
        "logo": logo,
        "cover": cover,
        "image": image,
        "about": about,
        "phone_numbers": phone_numbers,
        "emails": emails,
        "fee_structure": fee_table
    }
    return result


def extract_table_data(response):
    soup = BeautifulSoup(response.text, "html.parser")
    table = soup.find("table", {"class": "table table-striped"})
    table_data = []

    if table:
        for row in table.find_all("tr"):
            cols = row.find_all("td")
            cols = [ele.text.strip() for ele in cols]
            table_data.append([ele for ele in cols if ele])  # Add non-empty cells
    else:
        print("Table not found.")
        
    return table_data

if __name__ == "__main__":
    postTo = "http://localhost:4000/university/"
    for university in universities:
        data = crawl_university(university)
        feeStructure = []
        fee = []

        url = "https://ndu.edu.pk/fcs/fcs_fee.php"

        try:
            response = requests.get(url)
            response.raise_for_status()
            fee = extract_table_data(response)
        except requests.exceptions.RequestException as e:
            print(f"Error fetching the page: {e}")

        for row in range(1, len(fee)):
            # print(fee[row])
            # row = fee[row][0:2] + fee[row][5:]
            #feeStructure.append(row)
            if len(fee[row]) > 4 and row > 1:
                feeDetails = {
                        fee[1][0]: fee[row][0],  # S No.
                        fee[1][1]: fee[row][1], # Desc
                        fee[1][2]: fee[row][2], # BS
                        fee[1][3]: fee[row][3], # MPhil
                        fee[1][4]: fee[row][4], # PHD
                        }
                feeStructure.append(feeDetails)

        dataToSubmit = {
            "moto": "\"Taught man that which he knew not.\" Al-Quran (30:96:5)",
            "name": data["name"],
            "image": data["image"],
            "logo": data["logo"],
            "about": data["about"],
            "cover": data["cover"],
            "contact": {
                "number": data["phone_numbers"],
                "email": data["emails"],
                "website": university["baseUrl"]
            },
            "feeStructure": feeStructure
        }
        post_data_to_backend(postTo, dataToSubmit)
