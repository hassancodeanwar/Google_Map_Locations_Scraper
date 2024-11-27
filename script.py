import logging
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from bs4 import BeautifulSoup
import pandas as pd
import time
import random


catigory = "place-name"
state = "state"
stat_shortcut= 'state-shortcut'

# Set up logging
logging.basicConfig(
    filename=f'{state}_{catigory}_scraper.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

def collect_all_places_data():
    # Initialize the WebDriver
    driver = webdriver.Chrome()

    try:
        driver.get('https://www.google.com/maps')
        logging.info('Opened Google Maps.')

        search_box = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//input[@id='searchboxinput']"))
        )
        search_box.send_keys(f"{catigory} in {state}, USA")
        search_box.send_keys(Keys.ENTER)
        logging.info(f'Searched for places in {state}.')

        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.CLASS_NAME, "Nv2PK"))
        )
        logging.info('Search results loaded.')

        scrollable_div = driver.find_element(By.XPATH, "//div[contains(@class, 'm6QErb') and contains(@class, 'WNBkOb') and contains(@class, 'XiKgde')]")

        end_of_list_found = False
        data_list = []
        processed_links = set()

        while not end_of_list_found:
            results = driver.find_elements(By.CLASS_NAME, "Nv2PK")

            for result in results:
                try:
                    location_link_tag = result.find_element(By.CSS_SELECTOR, "a.hfpxzc")
                    location_link = location_link_tag.get_attribute('href') if location_link_tag else None

                    if location_link and location_link in processed_links:
                        logging.info(f"Duplicate entry found, skipping: {location_link}")
                        continue

                    result.click()
                    time.sleep(random.uniform(2, 4))

                    soup = BeautifulSoup(driver.page_source, 'html.parser')

                    # Safe extraction with fallback values
                    name_tag = soup.find('h1', class_='DUwDvf')
                    name = name_tag.text.strip() if name_tag else 'Name not found'

                    address_div = soup.find('div', class_='Io6YTe')
                    address = address_div.text.strip() if address_div else 'Address not found'

                    rating_div = soup.find('div', class_='fontDisplayLarge')
                    average_rating = rating_div.find('span', dir='ltr').text.strip() if rating_div and rating_div.find('span', dir='ltr') else 'N/A'

                    raters_button = soup.find('button', class_='HHrUdb')
                    number_of_raters = raters_button.find('span').text.strip().split('عدد التعليقات: ')[-1] if raters_button and raters_button.find('span') else 'N/A'

                    hours_table = soup.find('table', class_='eK4R0e')
                    if hours_table:
                        hours_rows = hours_table.find_all('tr')
                        hours = [f"{row.find('td', class_='ylH6lf').text.strip()}: {row.find('td', class_='mxowUb').text.strip()}" for row in hours_rows]
                        hours = '; '.join(hours)
                    else:
                        hours = 'Hours not listed'

                    data_list.append({
                        'Name': name,
                        'Address': address,
                        'Location Link': location_link,
                        'Average Rating': average_rating,
                        'Number of Raters': number_of_raters,
                        'Hours': hours
                    })

                    processed_links.add(location_link)
                    logging.info(f"Collected data for: {name}")

                    try:
                        close_button = WebDriverWait(driver, 15).until(
                            EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'VfPpkd-icon-LgbsSe') and @aria-label='إغلاق']"))
                        )
                        close_button.click()
                        time.sleep(random.uniform(1, 3))
                    except TimeoutException:
                        logging.warning(f"Could not find the close button for: {name}. Moving to the next result.")
                        time.sleep(random.uniform(1, 3))

                except NoSuchElementException as e:
                    logging.error(f"Element not found for link {location_link}: {e}")
                except Exception as e:
                    logging.error(f"Error processing result for link {location_link}: {e}")

            driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", scrollable_div)
            time.sleep(random.uniform(4, 6))

            try:
                end_message = driver.find_element(By.XPATH, "//div[contains(@class, 'm6QErb') and contains(@class, 'XiKgde') and contains(@class, 'tLjsW') and contains(@class, 'eKbjU')]/div/p/span/span[contains(text(), 'لقد وصلت إلى نهاية القائمة.')]")
                end_of_list_found = True
                logging.info("Reached the end of the list.")
            except NoSuchElementException:
                logging.info("Scrolling...")

        df = pd.DataFrame(data_list)
        df.to_csv(f'{state}_{catigory}_data001.csv', index=False)
        logging.info(f"Data collection complete. Check {state}_{catigory}_data001.csv")

    except Exception as e:
        logging.critical(f"A critical error occurred: {e}")

    finally:
        driver.quit()
        logging.info("WebDriver closed.")

if __name__ == "__main__":
    collect_all_places_data()
