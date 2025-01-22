from lxml import html
from urllib.parse import urljoin
import requests
import json

universities = [
    {
        "baseUrl": "https://qau.edu.pk/",
        "body": {
            "name": {"type": "String", "path": {
                "select": 'Quaid-i-Azam University',
                "next": "direct"
            }},
            "image": {"type": "String", "path": {
                "select": '//qau.edu.pk/wp-content/uploads/2021/05/logo-15.png',
                "next": "direct"
            }},
            "logo": {"type": "String", "path": {
                "select": '//qau.edu.pk/wp-content/uploads/2021/05/logo-15.png',
                "next": "direct"
            }},
            "about": {"type": "String",
                      "path": {
                          "navigate": '/introduction/',
                          "select": '/html/body/div[1]/div[3]/div/div/div/div/section[1]/div/div/div[1]/div/div/div',
                          "next": 'select text'
                      }
                      },
            "cover": {"type": "String", "path": {
                "navigate": '/introduction/',
                "select": '/html/body/div[1]/div[2]/img',
                "next": "select imageUrl"
            }},
            "contact": {
                "number": {"type": "String array", "path": {
                "navigate": '/contact-list/',
                    "next": "extract phone numbers"
                }},
                "email": {"type": "String array", "path": {
                "navigate": '/contact-list/',
                    "next": "extract email addresses"
                }},
                "website": {"type": "String", "select": "base url"},
            },
            "feeStructure": {
                "type": "key-value",
                "path": {
                    "navigate": "/bachelor-fee-structure/",
                    "select": '/html/body/div[1]/div[3]/div/div/div/div/section[1]/div/div/div[1]/div/div',
                    "next": "select second and last column"
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
    logo = body["image"]["path"]["select"]
    cover = body["image"]["path"]["select"]
    image = body["image"]["path"]["select"]
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


def extract_table_data(table_element):
    if isinstance(table_element, list):
        if len(table_element) == 0:
            return []  # If table element is an empty list, return an empty list.
        else:
            table_element = table_element[0]  # If it's a list, access the first element.

    table_data = []

    # Iterate through each row in the table
    rows = table_element.xpath('.//tr')  # Extract rows
    for row in rows:
        # Get the columns (either <td> or <th>)
        columns = row.xpath('.//td | .//th')
        # Extract the text content of each column, stripping any extra spaces
        row_data = [col.text_content().strip() for col in columns]
        table_data.append(row_data)

    return table_data


if __name__ == "__main__":
    postTo = "http://localhost:4000/university/"
    for university in universities:
        data = crawl_university(university)
        fee = extract_table_data(data['fee_structure'][0:])
        feeStructure = []
        category = ""
        # Iterate through the fee data to extract relevant information
        for row in range(1, len(fee)):
            if len(fee[row]) == 1:
                category = fee[row][0]
            if len(fee[row]) > 3:  # Check if there's a valid course name
            # Create a dictionary to hold all relevant data for the course
                feeDetails = {
                        'S.No': fee[row][0],  # Course Name
                        'Fee Heads': fee[row][1],  # Fee per Credit
                        'Regular Fee (Fall 24)': fee[row][2],  # Regular Fee
                        'S.F/Evening Fee (Fall 24)': fee[row][3],  # S.F/Evening Fee
                        'Category': category  # Fee Category
                }
                feeStructure.append(feeDetails)
        dataToSubmit = {
            "moto": "Taking Pakistan forward by providing an affordable, high standard education to students from all corners of the country, creating interprovincial harmony, providing solutions through research relevant to the national needs, towards the transformation of the country into a knowledge-based economy.",
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
