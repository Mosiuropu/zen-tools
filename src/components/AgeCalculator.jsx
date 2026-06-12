import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  Plus, Trash2, User, BarChartHorizontal, Download, Cake, ChevronRight,
  Bookmark, Heart, ArrowLeftRight, BarChart3, UserPlus, Search, Target,
  Share2, PieChart, Shuffle
} from 'lucide-react';
import { intervalToDuration, differenceInDays, differenceInMonths, format } from 'date-fns';
import html2canvas from 'html2canvas';

const PERSON_COLORS = [
  { bar: '#4F6A33', light: 'rgba(79, 106, 51, 0.15)', name: 'Sage' },
  { bar: '#B8634A', light: 'rgba(184, 99, 74, 0.15)', name: 'Terracotta' },
  { bar: '#4A7B9D', light: 'rgba(74, 123, 157, 0.15)', name: 'Steel Blue' },
  { bar: '#9B6B9E', light: 'rgba(155, 107, 158, 0.15)', name: 'Mauve' },
  { bar: '#C8914A', light: 'rgba(200, 145, 74, 0.15)', name: 'Amber' },
  { bar: '#6B8E7B', light: 'rgba(107, 142, 123, 0.15)', name: 'Moss' },
  { bar: '#A05A6E', light: 'rgba(160, 90, 110, 0.15)', name: 'Rose' },
  { bar: '#5A7B8C', light: 'rgba(90, 123, 140, 0.15)', name: 'Slate' },
  { bar: '#8B6B4A', light: 'rgba(139, 107, 74, 0.15)', name: 'Taupe' },
  { bar: '#6B5B8C', light: 'rgba(107, 91, 140, 0.15)', name: 'Lavender' },
];

const EMOJI_REGION_MAP = {
  '🇧🇩': 'Bangladesh', '🇮🇳': 'India',
  '🇵🇰': 'South Asia', '🇱🇰': 'South Asia', '🇳🇵': 'South Asia', '🇧🇹': 'South Asia',
  '🇨🇳': 'East Asia', '🇯🇵': 'East Asia', '🇰🇷': 'East Asia', '🇹🇼': 'East Asia', '🇭🇰': 'East Asia', '🇰🇵': 'East Asia',
  '🇻🇳': 'Southeast Asia', '🇲🇲': 'Southeast Asia', '🇰🇭': 'Southeast Asia', '🇹🇭': 'Southeast Asia',
  '🇿🇦': 'Africa', '🇬🇭': 'Africa', '🇹🇿': 'Africa', '🇰🇪': 'Africa', '🇪🇹': 'Africa',
  '🇨🇩': 'Africa', '🇲🇿': 'Africa', '🇳🇬': 'Africa',
  '🇵🇸': 'Middle East', '🇮🇱': 'Middle East', '🇪🇬': 'Middle East', '🇮🇶': 'Middle East',
  '🇱🇾': 'Middle East', '🇹🇷': 'Middle East', '🇮🇷': 'Middle East',
  '🇬🇧': 'Europe', '🇩🇪': 'Europe', '🇫🇷': 'Europe', '🇮🇹': 'Europe', '🇪🇸': 'Europe',
  '🇳🇱': 'Europe', '🇦🇹': 'Europe', '🇵🇱': 'Europe', '🇷🇸': 'Europe',
  '🇨🇿': 'Europe', '🇷🇺': 'Europe', '🇸🇪': 'Europe', '🇨🇭': 'Europe',
  '🇨🇺': 'Latin America', '🇦🇷': 'Latin America', '🇲🇽': 'Latin America',
  '🇻🇪': 'Latin America', '🇧🇷': 'Latin America', '🇯🇲': 'Latin America',
  '🇨🇴': 'Latin America',
  '🇺🇸': 'USA', '🇨🇦': 'USA',
  '🇦🇺': 'Oceania',
};

const getRegion = (desc) => {
  const emoji = desc.match(/^([\u{1F1E6}-\u{1F1FF}]{2})/u);
  if (emoji) return EMOJI_REGION_MAP[emoji[1]] || 'Other';
  return 'Other';
};

const FAMOUS_PEOPLE = [
  // ———————————————————————
  // 🇧🇩 BANGLADESH (বাংলাদেশ)
  // ———————————————————————
  { name: 'Sheikh Mujibur Rahman', birth: '1920-03-17', death: '1975-08-15', desc: '🇧🇩 Father of the Nation, 55' },
  { name: 'Kazi Nazrul Islam', birth: '1899-05-24', death: '1976-08-29', desc: '🇧🇩 National poet, rebel poet, 77' },
  { name: 'Rabindranath Tagore', birth: '1861-05-07', death: '1941-08-07', desc: '🇧🇩🇮🇳 Nobel poet, composer, 80' },
  { name: 'Begum Rokeya', birth: '1880-12-09', death: '1932-12-09', desc: '🇧🇩 Feminist writer, pioneer, 52' },
  { name: 'Jasimuddin', birth: '1903-01-01', death: '1976-03-14', desc: '🇧🇩 Pastoral poet, 73' },
  { name: 'Shamsur Rahman', birth: '1929-10-23', death: '2006-08-17', desc: '🇧🇩 Modern poet, 76' },
  { name: 'Humayun Ahmed', birth: '1948-11-13', death: '2012-07-19', desc: '🇧🇩 Writer, filmmaker, 63' },
  { name: 'Zahir Raihan', birth: '1935-08-19', death: '1972-01-01', desc: '🇧🇩 Writer, filmmaker, 36' },
  { name: 'Syed Mujtaba Ali', birth: '1904-09-13', death: '1974-02-11', desc: '🇧🇩 Writer, scholar, 69' },
  { name: 'Akhtaruzzaman Elias', birth: '1943-02-12', death: '1999-01-04', desc: '🇧🇩 Novelist, 55' },
  { name: 'Abdus Salam', birth: '1926-01-29', death: '1996-11-21', desc: '🇧🇩 Nobel Prize physicist, 70' },
  { name: 'Jamal Nazrul Islam', birth: '1939-02-24', death: '2013-03-16', desc: '🇧🇩 Mathematician, physicist, 74' },
  { name: 'M. A. Wazed Miah', birth: '1942-02-16', death: '2009-05-09', desc: '🇧🇩 Nuclear scientist, 67' },
  { name: 'Ziaur Rahman', birth: '1936-01-19', death: '1981-05-30', desc: '🇧🇩 President, freedom fighter, 45' },
  { name: 'Hussain M. Ershad', birth: '1930-02-01', death: '2019-07-14', desc: '🇧🇩 President, army chief, 89' },
  { name: 'Tajuddin Ahmad', birth: '1925-07-23', death: '1975-11-03', desc: '🇧🇩 First PM, 50' },
  { name: 'M. A. G. Osmani', birth: '1918-09-01', death: '1984-02-16', desc: '🇧🇩 Liberation War commander, 65' },
  { name: 'Abdul Hamid Khan Bhashani', birth: '1880-12-12', death: '1976-11-17', desc: '🇧🇩 Peasant leader, 95' },
  { name: 'Zainul Abedin', birth: '1914-12-29', death: '1976-05-28', desc: '🇧🇩 Pioneer artist, 61' },
  { name: 'SM Sultan', birth: '1923-08-10', death: '1994-10-10', desc: '🇧🇩 Painter, 71' },
  { name: 'Lalon Fakir', birth: '1774-10-17', death: '1890-10-17', desc: '🇧🇩 Mystic poet, baul saint, 116' },
  { name: 'Abbas Uddin Ahmed', birth: '1901-10-27', death: '1959-12-30', desc: '🇧🇩 Folk singer, 58' },
  { name: 'Abdul Alim', birth: '1931-07-27', death: '1974-09-05', desc: '🇧🇩 Folk singer, 43' },
  { name: 'Rafiq Uddin Ahmed', birth: '1926-10-30', death: '1952-02-21', desc: '🇧🇩 Language martyr, 25' },
  { name: 'Abul Barkat', birth: '1927-06-16', death: '1952-02-21', desc: '🇧🇩 Language martyr, 24' },
  { name: 'Abdul Jabbar', birth: '1919-08-05', death: '1952-02-21', desc: '🇧🇩 Language martyr, 32' },
  { name: 'Shahidullah Kaiser', birth: '1927-02-16', death: '1971-12-14', desc: '🇧🇩 Writer, intellectual martyr, 44' },
  { name: 'Al Mahmud', birth: '1936-07-11', death: '2019-02-15', desc: '🇧🇩 Poet, novelist, 82' },
  { name: 'Satyen Sen', birth: '1907-03-28', death: '1981-04-06', desc: '🇧🇩 Folk singer, activist, 74' },
  { name: 'Mohan Khan', birth: '1944-12-08', death: '2019-03-07', desc: '🇧🇩 Football legend, 74' },

  // ———————————————————————
  // 🇮🇳 INDIA
  // ———————————————————————
  { name: 'Mahatma Gandhi', birth: '1869-10-02', death: '1948-01-30', desc: '🇮🇳 Father of the Nation, non-violence, 78' },
  { name: 'Jawaharlal Nehru', birth: '1889-11-14', death: '1964-05-27', desc: '🇮🇳 First PM, architect of modern India, 74' },
  { name: 'Sardar Vallabhbhai Patel', birth: '1875-10-31', death: '1950-12-15', desc: '🇮🇳 Iron Man, united India, 75' },
  { name: 'Subhas Chandra Bose', birth: '1897-01-23', death: '1945-08-18', desc: '🇮🇳 Netaji, freedom fighter, INA, 48' },
  { name: 'Bhagat Singh', birth: '1907-09-27', death: '1931-03-23', desc: '🇮🇳 Revolutionary, martyr, 23' },
  { name: 'B. R. Ambedkar', birth: '1891-04-14', death: '1956-12-06', desc: '🇮🇳 Constitution architect, 65' },
  { name: 'Indira Gandhi', birth: '1917-11-19', death: '1984-10-31', desc: '🇮🇳 First woman PM, 66' },
  { name: 'Rajiv Gandhi', birth: '1944-08-20', death: '1991-05-21', desc: '🇮🇳 Youngest PM, 46' },
  { name: 'Atal Bihari Vajpayee', birth: '1924-12-25', death: '2018-08-16', desc: '🇮🇳 PM, poet, statesman, 93' },
  { name: 'Maulana Abul Kalam Azad', birth: '1888-11-11', death: '1958-02-22', desc: '🇮🇳 Scholar, independence leader, 69' },
  { name: 'Sarojini Naidu', birth: '1879-02-13', death: '1949-03-02', desc: '🇮🇳 Poet, Nightingale of India, 70' },
  { name: 'Lal Bahadur Shastri', birth: '1904-10-02', death: '1966-01-11', desc: '🇮🇳 PM, Jai Jawan Jai Kisan, 61' },
  { name: 'A. P. J. Abdul Kalam', birth: '1931-10-15', death: '2015-07-27', desc: '🇮🇳 President, Missile Man, 83' },
  { name: 'C. V. Raman', birth: '1888-11-07', death: '1970-11-21', desc: '🇮🇳 Nobel physicist, 82' },
  { name: 'Homi J. Bhabha', birth: '1909-10-30', death: '1966-01-24', desc: '🇮🇳 Nuclear physicist, 56' },
  { name: 'Vikram Sarabhai', birth: '1919-08-12', death: '1971-12-30', desc: '🇮🇳 Space program father, 52' },
  { name: 'S. Ramanujan', birth: '1887-12-22', death: '1920-04-26', desc: '🇮🇳 Mathematical genius, 32' },
  { name: 'Jagdish Chandra Bose', birth: '1858-11-30', death: '1937-11-23', desc: '🇮🇳 Physicist, biologist, 78' },
  { name: 'S. Chandrasekhar', birth: '1910-10-19', death: '1995-08-21', desc: '🇮🇳 Astrophysicist, Nobel, 84' },
  { name: 'Swami Vivekananda', birth: '1863-01-12', death: '1902-07-04', desc: '🇮🇳 Monk, philosopher, 39' },
  { name: 'Paramahansa Yogananda', birth: '1893-01-05', death: '1952-03-07', desc: '🇮🇳 Yoga guru, Autobiography, 59' },
  { name: 'Mother Teresa', birth: '1910-08-26', death: '1997-09-05', desc: '🇮🇳 Saint, Nobel Peace Prize, 87' },
  { name: 'Osho / Bhagwan Rajneesh', birth: '1931-12-11', death: '1990-01-19', desc: '🇮🇳 Spiritual teacher, 58' },
  { name: 'Maharishi Mahesh Yogi', birth: '1918-01-12', death: '2008-02-05', desc: '🇮🇳 Transcendental Meditation, 90' },
  { name: 'Sathya Sai Baba', birth: '1926-11-23', death: '2011-04-24', desc: '🇮🇳 Spiritual leader, 84' },
  { name: 'Dilip Kumar', birth: '1922-12-11', death: '2021-07-07', desc: '🇮🇳 Legend actor, Tragedy King, 98' },
  { name: 'Raj Kapoor', birth: '1924-12-14', death: '1988-06-02', desc: '🇮🇳 Actor, filmmaker, showman, 63' },
  { name: 'Sridevi', birth: '1963-08-13', death: '2018-02-24', desc: '🇮🇳 Actress, icon, 54' },
  { name: 'Irrfan Khan', birth: '1967-01-07', death: '2020-04-29', desc: '🇮🇳 Actor, global star, 53' },
  { name: 'Madhubala', birth: '1933-02-14', death: '1969-02-23', desc: '🇮🇳 Actress, beauty icon, 36' },
  { name: 'Meena Kumari', birth: '1933-08-01', death: '1972-03-31', desc: '🇮🇳 Actress, Tragedy Queen, 38' },
  { name: 'R. K. Narayan', birth: '1906-10-10', death: '2001-05-13', desc: '🇮🇳 Author, Malgudi Days, 94' },
  { name: 'Mulk Raj Anand', birth: '1905-12-12', death: '2004-09-28', desc: '🇮🇳 Author, Coolie, 98' },
  { name: 'Premchand', birth: '1880-07-31', death: '1936-10-08', desc: '🇮🇳 Writer, Urdu/Hindi literature, 56' },
  { name: 'Mahasweta Devi', birth: '1926-01-14', death: '2016-07-28', desc: '🇮🇳 Writer, activist, 90' },
  { name: 'Ravi Shankar', birth: '1920-04-07', death: '2012-12-11', desc: '🇮🇳 Sitar maestro, global icon, 92' },
  { name: 'M. S. Subbulakshmi', birth: '1916-09-16', death: '2004-12-11', desc: '🇮🇳 Carnatic singer, 88' },
  { name: 'Kishore Kumar', birth: '1929-08-04', death: '1987-10-13', desc: '🇮🇳 Singer, actor, legend, 58' },
  { name: 'Lata Mangeshkar', birth: '1929-09-28', death: '2022-02-06', desc: '🇮🇳 Nightingale, singer, 92' },
  { name: 'Bhimsen Joshi', birth: '1922-02-04', death: '2011-01-24', desc: '🇮🇳 Classical vocalist, 88' },
  { name: 'Uday Shankar', birth: '1900-12-08', death: '1977-09-26', desc: '🇮🇳 Dancer, choreographer, 76' },
  { name: 'Milkha Singh', birth: '1929-10-17', death: '2021-06-18', desc: '🇮🇳 Flying Sikh, sprinter, 91' },
  { name: 'Dhyan Chand', birth: '1905-08-29', death: '1979-12-03', desc: '🇮🇳 Hockey wizard, 74' },
  { name: 'J. R. D. Tata', birth: '1904-07-29', death: '1993-11-29', desc: '🇮🇳 Industrialist, aviation pioneer, 89' },
  { name: 'Dhirubhai Ambani', birth: '1932-12-28', death: '2002-07-06', desc: '🇮🇳 Reliance founder, 69' },
  { name: 'Ramanuja', birth: '1017-01-01', death: '1137-01-01', desc: '🇮🇳 Hindu philosopher, 120' },
  { name: 'Narayana Guru', birth: '1856-08-20', death: '1928-09-20', desc: '🇮🇳 Spiritual leader, social reformer, 72' },
  { name: 'Tenzing Norgay', birth: '1914-05-29', death: '1986-05-09', desc: '🇳🇵 Mountaineer, Everest first ascent, 71' },

  // ———————————————————————
  // 🌍 SOUTH ASIA (Pakistan, Sri Lanka, Nepal, Bhutan)
  // ———————————————————————
  { name: 'Muhammad Ali Jinnah', birth: '1876-12-25', death: '1948-09-11', desc: '🇵🇰 Founder of Pakistan, 71' },
  { name: 'Allama Iqbal', birth: '1877-11-09', death: '1938-04-21', desc: '🇵🇰 Poet, philosopher, 60' },
  { name: 'Benazir Bhutto', birth: '1953-06-21', death: '2007-12-27', desc: '🇵🇰 First woman PM, 54' },
  { name: 'Zulfikar Ali Bhutto', birth: '1928-01-05', death: '1979-04-04', desc: '🇵🇰 PM, founder of PPP, 51' },
  { name: 'Abdul Sattar Edhi', birth: '1928-02-28', death: '2016-07-08', desc: '🇵🇰 Humanitarian, philanthropist, 88' },
  { name: 'Malala Yousafzai', birth: '1997-07-12', death: null, desc: '🇵🇰 Nobel activist, education, alive' },
  { name: 'Nusrat Fateh Ali Khan', birth: '1948-10-13', death: '1997-08-16', desc: '🇵🇰 Qawwali legend, 48' },
  { name: 'Faiz Ahmed Faiz', birth: '1911-02-13', death: '1984-11-20', desc: '🇵🇰 Revolutionary poet, 73' },
  { name: 'Sirimavo Bandaranaike', birth: '1916-04-17', death: '2000-10-10', desc: '🇱🇰 World first woman PM, 84' },
  { name: 'Arthur C. Clarke', birth: '1917-12-16', death: '2008-03-19', desc: '🇬🇧🇱🇰 Author, futurist, 90' },
  { name: 'Mahinda Rajapaksa', birth: '1945-11-18', death: null, desc: '🇱🇰 Sri Lankan president, alive' },
  { name: 'Edmund Hillary', birth: '1919-07-20', death: '2008-01-11', desc: '🇳🇿 Mountaineer, Everest first ascent, 88' },

  // ———————————————————————
  // 🌍 WORLD LEADERS & POLITICIANS
  // ———————————————————————
  { name: 'Nelson Mandela', birth: '1918-07-18', death: '2013-12-05', desc: '🇿🇦 Anti-apartheid, president, 95' },
  { name: 'Winston Churchill', birth: '1874-11-30', death: '1965-01-24', desc: '🇬🇧 UK PM, WWII leader, 90' },
  { name: 'Mao Zedong', birth: '1893-12-26', death: '1976-09-09', desc: '🇨🇳 Chinese revolutionary leader, 82' },
  { name: 'Deng Xiaoping', birth: '1904-08-22', death: '1997-02-19', desc: '🇨🇳 Chinese reformer, 92' },
  { name: 'Ho Chi Minh', birth: '1890-05-19', death: '1969-09-02', desc: '🇻🇳 Vietnamese independence leader, 79' },
  { name: 'Fidel Castro', birth: '1926-08-13', death: '2016-11-25', desc: '🇨🇺 Cuban revolutionary leader, 90' },
  { name: 'Che Guevara', birth: '1928-06-14', death: '1967-10-09', desc: '🇦🇷 Revolutionary, icon, 39' },
  { name: 'Kwame Nkrumah', birth: '1909-09-21', death: '1972-04-27', desc: '🇬🇭 Ghana independence leader, 62' },
  { name: 'Julius Nyerere', birth: '1922-04-13', death: '1999-10-14', desc: '🇹🇿 Tanzania president, 77' },
  { name: 'Jomo Kenyatta', birth: '1891-01-01', death: '1978-08-22', desc: '🇰🇪 Kenya founding president, 87' },
  { name: 'Haile Selassie', birth: '1892-07-23', death: '1975-08-27', desc: '🇪🇹 Ethiopian emperor, Rastafari, 83' },
  { name: 'Patrice Lumumba', birth: '1925-07-02', death: '1961-01-17', desc: '🇨🇩 Congo independence leader, 35' },
  { name: 'Samora Machel', birth: '1933-09-29', death: '1986-10-19', desc: '🇲🇿 Mozambique president, 53' },
  { name: 'Yasser Arafat', birth: '1929-08-24', death: '2004-11-11', desc: '🇵🇸 Palestinian leader, 75' },
  { name: 'Golda Meir', birth: '1898-05-03', death: '1978-12-08', desc: '🇮🇱 Israeli PM, 80' },
  { name: 'Anwar Sadat', birth: '1918-12-25', death: '1981-10-06', desc: '🇪🇬 Egyptian president, Nobel, 62' },
  { name: 'Gamal Abdel Nasser', birth: '1918-01-15', death: '1970-09-28', desc: '🇪🇬 Egyptian leader, pan-Arabism, 52' },
  { name: 'Saddam Hussein', birth: '1937-04-28', death: '2006-12-30', desc: '🇮🇶 Iraqi president, 69' },
  { name: 'Muammar Gaddafi', birth: '1942-06-07', death: '2011-10-20', desc: '🇱🇾 Libyan leader, 69' },
  { name: 'Jimmy Carter', birth: '1924-10-01', death: '2024-12-29', desc: '🇺🇸 39th US President, humanitarian, 100' },
  { name: 'Ronald Reagan', birth: '1911-02-06', death: '2004-06-05', desc: '🇺🇸 40th US President, 93' },
  { name: 'John F. Kennedy', birth: '1917-05-29', death: '1963-11-22', desc: '🇺🇸 35th US President, 46' },
  { name: 'Abraham Lincoln', birth: '1809-02-12', death: '1865-04-15', desc: '🇺🇸 16th US President, emancipation, 56' },
  { name: 'Franklin D. Roosevelt', birth: '1882-01-30', death: '1945-04-12', desc: '🇺🇸 32nd US President, New Deal, 63' },
  { name: 'Kemal Atatürk', birth: '1881-01-01', death: '1938-11-10', desc: '🇹🇷 Founder of modern Turkey, 57' },
  { name: 'Simón Bolívar', birth: '1783-07-24', death: '1830-12-17', desc: '🇻🇪 Liberator of South America, 47' },
  { name: 'Sun Yat-sen', birth: '1866-11-12', death: '1925-03-12', desc: '🇹🇼 Father of modern China, 58' },
  { name: 'Aung San', birth: '1915-02-13', death: '1947-07-19', desc: '🇲🇲 Burmese independence leader, 32' },
  { name: 'Pol Pot', birth: '1925-05-19', death: '1998-04-15', desc: '🇰🇭 Khmer Rouge leader, 72' },
  { name: 'Kim Il-sung', birth: '1912-04-15', death: '1994-07-08', desc: '🇰🇵 North Korea founder, 82' },

  // ———————————————————————
  // 🌍 SCIENTISTS & INVENTORS
  // ———————————————————————
  { name: 'Albert Einstein', birth: '1879-03-14', death: '1955-04-18', desc: '🇩🇪🇺🇸 Theoretical physicist, relativity, 76' },
  { name: 'Isaac Newton', birth: '1643-01-04', death: '1727-03-31', desc: '🇬🇧 Physicist, calculus, gravity, 84' },
  { name: 'Nikola Tesla', birth: '1856-07-10', death: '1943-01-07', desc: '🇷🇸🇺🇸 Inventor, AC electricity, 86' },
  { name: 'Marie Curie', birth: '1867-11-07', death: '1934-07-04', desc: '🇵🇱🇫🇷 Nobel pioneer, radium, 66' },
  { name: 'Charles Darwin', birth: '1809-02-12', death: '1882-04-19', desc: '🇬🇧 Naturalist, evolution, 73' },
  { name: 'Galileo Galilei', birth: '1564-02-15', death: '1642-01-08', desc: '🇮🇹 Astronomer, physics pioneer, 77' },
  { name: 'Stephen Hawking', birth: '1942-01-08', death: '2018-03-14', desc: '🇬🇧 Cosmologist, black holes, 76' },
  { name: 'Leonardo da Vinci', birth: '1452-04-15', death: '1519-05-02', desc: '🇮🇹 Renaissance polymath, artist, 67' },
  { name: 'Alan Turing', birth: '1912-06-23', death: '1954-06-07', desc: '🇬🇧 Computer science pioneer, 41' },
  { name: 'Louis Pasteur', birth: '1822-12-27', death: '1895-09-28', desc: '🇫🇷 Microbiologist, pasteurization, 72' },
  { name: 'Thomas Edison', birth: '1847-02-11', death: '1931-10-18', desc: '🇺🇸 Inventor, light bulb, 84' },
  { name: 'Alexander Graham Bell', birth: '1847-03-03', death: '1922-08-02', desc: '🇬🇧🇺🇸 Telephone inventor, 75' },
  { name: 'Ada Lovelace', birth: '1815-12-10', death: '1852-11-27', desc: '🇬🇧 First computer programmer, 36' },
  { name: 'Florence Nightingale', birth: '1820-05-12', death: '1910-08-13', desc: '🇬🇧 Nursing pioneer, 90' },
  { name: 'Steve Jobs', birth: '1955-02-24', death: '2011-10-05', desc: '🇺🇸 Apple co-founder, 56' },
  { name: 'Henry Kissinger', birth: '1923-05-27', death: '2023-11-29', desc: '🇺🇸 Diplomat, Nobel, 100' },
  { name: 'Wangari Maathai', birth: '1940-04-01', death: '2011-09-25', desc: '🇰🇪 Environmentalist, Nobel, 71' },

  // ———————————————————————
  // 🌍 WRITERS & PHILOSOPHERS
  // ———————————————————————
  { name: 'William Shakespeare', birth: '1564-04-26', death: '1616-04-23', desc: '🇬🇧 Playwright, literary icon, 52' },
  { name: 'George Orwell', birth: '1903-06-25', death: '1950-01-21', desc: '🇬🇧 Author, 1984, Animal Farm, 46' },
  { name: 'Gabriel Garcia Marquez', birth: '1927-03-06', death: '2014-04-17', desc: '🇨🇴 Author, Nobel, 100 Years, 87' },
  { name: 'Pablo Neruda', birth: '1904-07-12', death: '1973-09-23', desc: '🇨🇱 Poet, Nobel, 69' },
  { name: 'Jane Austen', birth: '1775-12-16', death: '1817-07-18', desc: '🇬🇧 Novelist, Pride & Prejudice, 41' },
  { name: 'Virginia Woolf', birth: '1882-01-25', death: '1941-03-28', desc: '🇬🇧 Writer, modernist, 59' },
  { name: 'Chinua Achebe', birth: '1930-11-16', death: '2013-03-21', desc: '🇳🇬 Author, Things Fall Apart, 82' },
  { name: 'Rumi', birth: '1207-09-30', death: '1273-12-17', desc: '🇵🇸🇹🇷 Mystic poet, Sufi master, 66' },
  { name: 'Omar Khayyam', birth: '1048-05-18', death: '1131-12-04', desc: '🇮🇷 Poet, mathematician, 83' },
  { name: 'Ibn Sina / Avicenna', birth: '0980-01-01', death: '1037-06-01', desc: '🇮🇷 Polymath, medicine pioneer, 57' },
  { name: 'J.R.R. Tolkien', birth: '1892-01-03', death: '1973-09-02', desc: '🇬🇧 Author, Lord of the Rings, 81' },
  { name: 'Franz Kafka', birth: '1883-07-03', death: '1924-06-03', desc: '🇨🇿 Writer, Metamorphosis, 40' },
  { name: 'Ernest Hemingway', birth: '1899-07-21', death: '1961-07-02', desc: '🇺🇸 Author, Nobel, 61' },

  // ———————————————————————
  // 🌍 MUSICIANS & ARTISTS
  // ———————————————————————
  { name: 'Pablo Picasso', birth: '1881-10-25', death: '1973-04-08', desc: '🇪🇸 Modern artist, Cubism, 91' },
  { name: 'Vincent van Gogh', birth: '1853-03-30', death: '1890-07-29', desc: '🇳🇱 Post-impressionist painter, 37' },
  { name: 'Frida Kahlo', birth: '1907-07-06', death: '1954-07-13', desc: '🇲🇽 Mexican painter, 47' },
  { name: 'Diego Rivera', birth: '1886-12-08', death: '1957-11-24', desc: '🇲🇽 Mexican muralist, 70' },
  { name: 'Ludwig van Beethoven', birth: '1770-12-17', death: '1827-03-26', desc: '🇩🇪 Composer, genius, 56' },
  { name: 'Wolfgang A. Mozart', birth: '1756-01-27', death: '1791-12-05', desc: '🇦🇹 Composer, prodigy, 35' },
  { name: 'Freddie Mercury', birth: '1946-09-05', death: '1991-11-24', desc: '🇬🇧 Queen lead vocalist, 45' },
  { name: 'Michael Jackson', birth: '1958-08-29', death: '2009-06-25', desc: '🇺🇸 King of Pop, 50' },
  { name: 'David Bowie', birth: '1947-01-08', death: '2016-01-10', desc: '🇬🇧 Musician, chameleon, 69' },
  { name: 'Prince', birth: '1958-06-07', death: '2016-04-21', desc: '🇺🇸 Musician, Purple Rain, 57' },
  { name: 'Elvis Presley', birth: '1935-01-08', death: '1977-08-16', desc: '🇺🇸 King of Rock and Roll, 42' },
  { name: 'John Lennon', birth: '1940-10-09', death: '1980-12-08', desc: '🇬🇧 Beatle, peace activist, 40' },
  { name: 'Bob Marley', birth: '1945-02-06', death: '1981-05-11', desc: '🇯🇲 Reggae legend, 36' },
  { name: 'Fela Kuti', birth: '1938-10-15', death: '1997-08-02', desc: '🇳🇬 Afrobeat pioneer, activist, 58' },
  { name: 'Akira Kurosawa', birth: '1910-03-23', death: '1998-09-06', desc: '🇯🇵 Filmmaker, Seven Samurai, 88' },
  { name: 'Princess Diana', birth: '1961-07-01', death: '1997-08-31', desc: '🇬🇧 Royal, humanitarian, 36' },
  { name: 'Marilyn Monroe', birth: '1926-06-01', death: '1962-08-05', desc: '🇺🇸 Actress, cultural icon, 36' },
  { name: 'Bruce Lee', birth: '1940-11-27', death: '1973-07-20', desc: '🇭🇰 Martial artist, actor, 32' },
  { name: 'Robin Williams', birth: '1951-07-21', death: '2014-08-11', desc: '🇺🇸 Actor, comedian, 63' },
  { name: 'Bob Hope', birth: '1903-05-29', death: '2003-07-27', desc: '🇺🇸 Comedian, entertainer, 100' },
  { name: 'Muhammad Ali', birth: '1942-01-17', death: '2016-06-03', desc: '🇺🇸 Boxer, activist, 74' },
  { name: 'Pele', birth: '1940-10-23', death: '2022-12-29', desc: '🇧🇷 Football king, 82' },
  { name: 'Diego Maradona', birth: '1960-10-30', death: '2020-11-25', desc: '🇦🇷 Football genius, 60' },
  { name: 'Kobe Bryant', birth: '1978-08-23', death: '2020-01-26', desc: '🇺🇸 NBA legend, 41' },
  { name: 'Rosa Parks', birth: '1913-02-04', death: '2005-10-24', desc: '🇺🇸 Civil rights icon, 92' },
  { name: 'Queen Elizabeth II', birth: '1926-04-21', death: '2022-09-08', desc: '🇬🇧 Longest-reigning monarch, 96' },
  { name: 'Evita Perón', birth: '1919-05-07', death: '1952-07-26', desc: '🇦🇷 First Lady, icon, 33' },
  // ———————————————————————
  // 🌍 DIED YOUNG (under 35, all regions)
  // ———————————————————————
  { name: 'Anne Frank', birth: '1929-06-12', death: '1945-03-01', desc: '🇳🇱 Diary writer, Holocaust, 15' },
  { name: 'Kurt Cobain', birth: '1967-02-20', death: '1994-04-05', desc: '🇺🇸 Nirvana frontman, 27' },
  { name: 'Jimi Hendrix', birth: '1942-11-27', death: '1970-09-18', desc: '🇺🇸 Guitar legend, 27' },
  { name: 'Janis Joplin', birth: '1943-01-19', death: '1970-10-04', desc: '🇺🇸 Blues-rock singer, 27' },
  { name: 'Jim Morrison', birth: '1943-12-08', death: '1971-07-03', desc: '🇺🇸 The Doors frontman, 27' },
  { name: 'Amy Winehouse', birth: '1983-09-14', death: '2011-07-23', desc: '🇬🇧 Singer, Back to Black, 27' },
  { name: 'Tupac Shakur', birth: '1971-06-16', death: '1996-09-13', desc: '🇺🇸 Rapper, activist, 25' },
  { name: 'Sylvia Plath', birth: '1932-10-27', death: '1963-02-11', desc: '🇺🇸 Poet, novelist, 30' },
  { name: 'Rosalind Franklin', birth: '1920-07-25', death: '1958-04-16', desc: '🇬🇧 DNA structure pioneer, 37' },
  { name: 'Ayrton Senna', birth: '1960-03-21', death: '1994-05-01', desc: '🇧🇷 F1 legend, 34' },
  { name: 'Chester Bennington', birth: '1976-03-20', death: '2017-07-20', desc: '🇺🇸 Linkin Park vocalist, 41' },
  { name: 'Avicii / Tim Bergling', birth: '1989-09-08', death: '2018-04-20', desc: '🇸🇪 DJ, producer, Wake Me Up, 28' },
  { name: 'Heath Ledger', birth: '1979-04-04', death: '2008-01-22', desc: '🇦🇺 Actor, Joker, 28' },
  { name: 'River Phoenix', birth: '1970-08-23', death: '1993-10-31', desc: '🇺🇸 Actor, 23' },
  { name: 'John Belushi', birth: '1949-01-24', death: '1982-03-05', desc: '🇺🇸 Comedian, actor, 33' },
  { name: 'James Dean', birth: '1931-02-08', death: '1955-09-30', desc: '🇺🇸 Actor, Rebel Without a Cause, 24' },
  { name: 'Selena Quintanilla', birth: '1971-04-16', death: '1995-03-31', desc: '🇺🇸 Tejano singer, 23' },
  { name: 'XXXTentacion', birth: '1998-01-23', death: '2018-06-18', desc: '🇺🇸 Rapper, 20' },
  { name: 'Mac Miller', birth: '1992-01-19', death: '2018-09-07', desc: '🇺🇸 Rapper, 26' },
  { name: 'Juice WRLD', birth: '1998-12-02', death: '2019-12-08', desc: '🇺🇸 Rapper, 21' },
  { name: 'Pop Smoke', birth: '1999-07-20', death: '2020-02-19', desc: '🇺🇸 Rapper, 20' },
  { name: 'Lil Peep', birth: '1996-11-01', death: '2017-11-15', desc: '🇺🇸 Rapper, 21' },
  { name: 'Chadwick Boseman', birth: '1976-11-29', death: '2020-08-28', desc: '🇺🇸 Actor, Black Panther, 43' },
  { name: 'Paul Walker', birth: '1973-09-12', death: '2013-11-30', desc: '🇺🇸 Actor, Fast & Furious, 40' },
  { name: 'Naya Rivera', birth: '1987-01-12', death: '2020-07-08', desc: '🇺🇸 Actress, Glee, 33' },
  { name: 'Cameron Boyce', birth: '1999-05-28', death: '2019-07-06', desc: '🇺🇸 Actor, Disney, 20' },
  { name: 'George Michael', birth: '1963-06-25', death: '2016-12-25', desc: '🇬🇧 Singer, Wham!, 53' },
  { name: 'Whitney Houston', birth: '1963-08-09', death: '2012-02-11', desc: '🇺🇸 Singer, icon, 48' },
  { name: 'Michael Hutchence', birth: '1960-01-22', death: '1997-11-22', desc: '🇦🇺 INXS lead singer, 37' },
  { name: 'Biggie Smalls', birth: '1972-05-21', death: '1997-03-09', desc: '🇺🇸 Rapper, Notorious B.I.G., 24' },

  // ———————————————————————
  // 🌍 MORE DIVERSE ICONS
  // ———————————————————————
  { name: 'Desmond Tutu', birth: '1931-10-07', death: '2021-12-26', desc: '🇿🇦 Archbishop, activist, Nobel, 90' },
  { name: 'George Washington', birth: '1732-02-22', death: '1799-12-14', desc: '🇺🇸 1st US President, 67' },
  { name: 'Thomas Jefferson', birth: '1743-04-13', death: '1826-07-04', desc: '🇺🇸 3rd US President, Declaration, 83' },
  { name: 'John Adams', birth: '1735-10-30', death: '1826-07-04', desc: '🇺🇸 2nd US President, 90' },
  { name: 'Harry S. Truman', birth: '1884-05-08', death: '1972-12-26', desc: '🇺🇸 33rd US President, 88' },
  { name: 'Theodore Roosevelt', birth: '1858-10-27', death: '1919-01-06', desc: '🇺🇸 26th US President, 60' },
];

const FAMOUS_WITH_AGE = FAMOUS_PEOPLE.map(fp => {
  const start = new Date(fp.birth);
  const end = fp.death ? new Date(fp.death) : null;
  const valid = !isNaN(start.getTime()) && end && !isNaN(end.getTime()) && end >= start;
  const yrs = valid ? (intervalToDuration({ start, end }).years || 0) : null;
  return {
    ...fp,
    lifespanYears: yrs,
    region: getRegion(fp.desc || ''),
  };
});

const AGE_RANGES = [
  { key: 'all', label: 'All', test: () => true },
  { key: 'young', label: 'Under 30', test: (y) => y < 30 },
  { key: 'mid', label: '30–49', test: (y) => y >= 30 && y < 50 },
  { key: 'senior', label: '50–69', test: (y) => y >= 50 && y < 70 },
  { key: 'oldest', label: '70+', test: (y) => y >= 70 },
];

const REGION_RANGES = [
  { key: 'all', label: 'All' },
  { key: 'Bangladesh', label: '🇧🇩 Bangladesh' },
  { key: 'India', label: '🇮🇳 India' },
  { key: 'South Asia', label: '🌏 S. Asia' },
  { key: 'East Asia', label: '🌏 E. Asia' },
  { key: 'Southeast Asia', label: '🌏 SE Asia' },
  { key: 'Africa', label: '🌍 Africa' },
  { key: 'Middle East', label: '🌍 M. East' },
  { key: 'Europe', label: '🌍 Europe' },
  { key: 'Latin America', label: '🌎 L. America' },
  { key: 'USA', label: '🇺🇸 USA' },
];

function calculateAgeData(startDate, endDate) {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    if (end < start) return null;
    const duration = intervalToDuration({ start, end });
    const totalDays = differenceInDays(end, start);
    const totalMonths = differenceInMonths(end, start);
    return { years: duration.years || 0, months: duration.months || 0, days: duration.days || 0, totalDays, totalMonths };
  } catch { return null; }
}

function getUpcomingBirthdays(people) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const birthdays = [];
  people.forEach(p => {
    const start = new Date(p.startDate);
    if (isNaN(start.getTime())) return;
    if (p.endDate) { const end = new Date(p.endDate); if (!isNaN(end.getTime()) && end < now) return; }
    const thisYearBday = new Date(currentYear, start.getMonth(), start.getDate());
    let nextBday = thisYearBday;
    if (thisYearBday < now) nextBday = new Date(currentYear + 1, start.getMonth(), start.getDate());
    if (p.endDate) { const end = new Date(p.endDate); if (!isNaN(end.getTime()) && nextBday > end) return; }
    const daysUntil = differenceInDays(nextBday, now);
    const age = nextBday.getFullYear() - start.getFullYear();
    if (daysUntil >= 0 && daysUntil <= 365) birthdays.push({ personId: p.id, name: p.name, nextBday, daysUntil, age, colorIndex: p.colorIndex });
  });
  return birthdays.sort((a, b) => a.daysUntil - b.daysUntil).slice(0, 10);
}

function getLifeReflections(people) {
  const me = people.find(p => p.name.toLowerCase() === 'me' || p.name.toLowerCase() === 'i');
  const viewer = me || people[0];
  if (!viewer) return null;
  const viewerAge = calculateAgeData(viewer.startDate, viewer.endDate);
  if (!viewerAge) return null;
  const vYears = viewerAge.years;
  const matches = FAMOUS_WITH_AGE.filter(fp => fp.lifespanYears !== null)
    .map(fp => ({ ...fp, diff: Math.abs(fp.lifespanYears - vYears), yearsDiff: Math.abs(fp.lifespanYears - vYears) }))
    .filter(m => m.diff <= 3).sort((a, b) => a.diff - b.diff).slice(0, 12);
  return { viewerAge: vYears, viewerName: viewer.name, matches };
}

function getTimeToTarget(people) {
  const now = new Date();
  const me = people.find(p => p.name.toLowerCase() === 'me' || p.name.toLowerCase() === 'i');
  const viewer = me || people[0];
  if (!viewer) return [];
  const viewerBirth = new Date(viewer.startDate);
  if (isNaN(viewerBirth.getTime())) return [];
  return people.filter(p => p.id !== viewer.id && p.endDate && new Date(p.endDate) < now).map(p => {
    const targetAge = calculateAgeData(p.startDate, p.endDate);
    if (!targetAge) return null;
    const targetEnd = new Date(viewer.startDate);
    targetEnd.setFullYear(targetEnd.getFullYear() + targetAge.years);
    targetEnd.setMonth(targetEnd.getMonth() + (targetAge.months || 0));
    targetEnd.setDate(targetEnd.getDate() + (targetAge.days || 0));
    if (targetEnd <= now) {
      const surpassed = calculateAgeData(p.startDate, now.toISOString().split('T')[0]);
      return { personId: p.id, name: p.name, colorIndex: p.colorIndex, targetAge: targetAge.years, surpassed: true, surpassedData: surpassed };
    }
    const remaining = calculateAgeData(now.toISOString().split('T')[0], targetEnd.toISOString().split('T')[0]);
    return { personId: p.id, name: p.name, colorIndex: p.colorIndex, targetAge: targetAge.years, surpassed: false, remaining };
  }).filter(Boolean).sort((a, b) => { if (a.surpassed && !b.surpassed) return 1; if (!a.surpassed && b.surpassed) return -1; return a.targetAge - b.targetAge; });
}

function getLifeClockData(people) {
  const valid = people.map(p => ({ ...p, age: calculateAgeData(p.startDate, p.endDate) })).filter(p => p.age && p.age.years > 0);
  if (valid.length < 2) return null;
  const total = valid.reduce((s, p) => s + p.age.years, 0);
  return valid.map(p => ({
    name: p.name,
    years: p.age.years,
    pct: (p.age.years / total) * 100,
    color: PERSON_COLORS[p.colorIndex % PERSON_COLORS.length],
  }));
}

function migratePeople(saved) {
  if (!Array.isArray(saved)) return null;
  return saved.map(p => ({
    id: p.id || crypto.randomUUID(), name: p.name || 'Person',
    startDate: p.dob || p.startDate || '2000-01-01',
    endDate: p.endDate || p.targetDate || new Date().toISOString().split('T')[0],
    colorIndex: p.colorIndex ?? 0,
  }));
}

export default function AgeCalculator() {
  const [people, setPeople] = useState(() => {
    try {
      const saved = localStorage.getItem('zen_age_people');
      if (!saved) return [
        { id: '1', name: 'Me', startDate: '1990-01-01', endDate: new Date().toISOString().split('T')[0], colorIndex: 0 },
        { id: '2', name: 'Einstein', startDate: '1879-03-14', endDate: '1955-04-18', colorIndex: 1 },
      ];
      const migrated = migratePeople(JSON.parse(saved));
      return migrated || [{ id: '1', name: 'Me', startDate: '1990-01-01', endDate: new Date().toISOString().split('T')[0], colorIndex: 0 }];
    } catch { return [{ id: '1', name: 'Me', startDate: '1990-01-01', endDate: new Date().toISOString().split('T')[0], colorIndex: 0 }]; }
  });

  const ganttRef = useRef(null);
  const ganttInnerRef = useRef(null);
  const [famousQuery, setFamousQuery] = useState('');
  const [famousAgeFilter, setFamousAgeFilter] = useState('all');
  const [famousRegionFilter, setFamousRegionFilter] = useState('all');
  const [showFamous, setShowFamous] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customPerson, setCustomPerson] = useState({ name: '', birth: '', death: '' });
  const [showComparison, setShowComparison] = useState(false);
  const [compareIds, setCompareIds] = useState([]);
  const [shareMsg, setShareMsg] = useState('');
  const [showLifeClock, setShowLifeClock] = useState(false);

  // Load from URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#age=')) {
      try {
        const decoded = JSON.parse(atob(decodeURIComponent(hash.slice(5))));
        if (Array.isArray(decoded) && decoded.length > 0) {
          const migrated = migratePeople(decoded);
          if (migrated) setPeople(migrated);
        }
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => { localStorage.setItem('zen_age_people', JSON.stringify(people)); }, [people]);
  useEffect(() => { if (shareMsg) { const t = setTimeout(() => setShareMsg(''), 2500); return () => clearTimeout(t); } }, [shareMsg]);

  const addPerson = () => {
    const idx = people.length % PERSON_COLORS.length;
    setPeople([...people, { id: crypto.randomUUID(), name: `Person ${people.length + 1}`, startDate: '2000-01-01', endDate: new Date().toISOString().split('T')[0], colorIndex: idx }]);
  };

  const addFamousPerson = (fp) => {
    if (!fp.death) return; // skip living people
    const idx = people.length % PERSON_COLORS.length;
    setPeople([...people, { id: crypto.randomUUID(), name: fp.name, startDate: fp.birth, endDate: fp.death, colorIndex: idx }]);
    setShowFamous(false); setFamousQuery(''); setFamousAgeFilter('all'); setFamousRegionFilter('all');
  };

  const addRandomFamousPerson = () => {
    const valid = FAMOUS_WITH_AGE.filter(fp => fp.lifespanYears !== null);
    if (valid.length === 0) return;
    const pick = valid[Math.floor(Math.random() * valid.length)];
    addFamousPerson(pick);
  };

  const addCustomPerson = () => {
    if (!customPerson.name.trim() || !customPerson.birth || !customPerson.death) return;
    const idx = people.length % PERSON_COLORS.length;
    setPeople([...people, { id: crypto.randomUUID(), name: customPerson.name.trim(), startDate: customPerson.birth, endDate: customPerson.death, colorIndex: idx }]);
    setCustomPerson({ name: '', birth: '', death: '' }); setShowCustom(false);
  };

  const removePerson = (id) => { if (people.length > 1) setPeople(people.filter(p => p.id !== id)); };
  const updatePerson = (id, field, value) => { setPeople(people.map(p => p.id === id ? { ...p, [field]: value } : p)); };

  const shareConfig = () => {
    const data = people.map(p => ({ name: p.name, startDate: p.startDate, endDate: p.endDate, colorIndex: p.colorIndex }));
    const encoded = encodeURIComponent(btoa(JSON.stringify(data)));
    const url = `${window.location.origin}${window.location.pathname}#age=${encoded}`;
    navigator.clipboard.writeText(url).then(() => setShareMsg('✅ Link copied!')).catch(() => setShareMsg('❌ Copy failed'));
  };

  const filteredFamous = useMemo(() => {
    let list = FAMOUS_WITH_AGE;
    // Age filter
    if (famousAgeFilter !== 'all') {
      const range = AGE_RANGES.find(r => r.key === famousAgeFilter);
      if (range) list = list.filter(f => f.lifespanYears !== null && range.test(f.lifespanYears));
    }
    // Region filter
    if (famousRegionFilter !== 'all') {
      list = list.filter(f => f.region === famousRegionFilter);
    }
    // Text search
    if (famousQuery.trim()) {
      const q = famousQuery.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q));
    }
    return list;
  }, [famousQuery, famousAgeFilter, famousRegionFilter]);

  const allDates = useMemo(() => {
    const dates = people.map(p => ({ start: new Date(p.startDate), end: new Date(p.endDate) }));
    const valid = dates.filter(d => !isNaN(d.start.getTime()) && !isNaN(d.end.getTime()) && d.end >= d.start);
    if (valid.length === 0) return null;
    const minDate = new Date(Math.min(...valid.map(d => d.start.getTime())));
    const maxDate = new Date(Math.max(...valid.map(d => d.end.getTime())));
    const totalSpan = differenceInDays(maxDate, minDate);
    if (totalSpan <= 0) return null;
    return { minDate, maxDate, totalSpan };
  }, [people]);

  const peopleData = useMemo(() => people.map(p => ({ ...p, age: calculateAgeData(p.startDate, p.endDate), color: PERSON_COLORS[p.colorIndex % PERSON_COLORS.length] })), [people]);
  const upcomingBirthdays = useMemo(() => getUpcomingBirthdays(people), [people]);
  const lifeReflections = useMemo(() => getLifeReflections(people), [people]);
  const timeTargets = useMemo(() => getTimeToTarget(people), [people]);
  const lifeClockData = useMemo(() => getLifeClockData(people), [people]);

  const lifespanStats = useMemo(() => {
    const valid = peopleData.filter(p => p.age !== null && p.age.years > 0);
    if (valid.length < 2) return null;
    const ages = valid.map(p => p.age.years);
    const sorted = [...ages].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    const avg = sum / sorted.length;
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    const min = sorted[0]; const max = sorted[sorted.length - 1];
    return { min, max, avg: Math.round(avg * 10) / 10, median: Math.round(median * 10) / 10, count: sorted.length, minPerson: valid.find(p => p.age.years === min), maxPerson: valid.find(p => p.age.years === max) };
  }, [peopleData]);

  const comparisonData = useMemo(() => {
    if (compareIds.length < 2) return null;
    const selected = compareIds.map(id => peopleData.find(p => p.id === id)).filter(Boolean);
    return selected.length >= 2 ? selected : null;
  }, [compareIds, peopleData]);

  const chartStart = allDates?.minDate;
  const chartEnd = allDates?.maxDate;
  const totalSpan = allDates?.totalSpan || 1;

  const getLeftPct = (d) => { if (!chartStart || !totalSpan) return 0; return Math.max(0, (differenceInDays(new Date(d), chartStart) / totalSpan) * 100); };
  const getWidthPct = (start, end) => { if (!totalSpan) return 0; return Math.max(1, (differenceInDays(new Date(end), new Date(start)) / totalSpan) * 100); };

  const exportGanttAsPNG = useCallback(async () => {
    const container = ganttRef.current;
    const inner = ganttInnerRef.current;
    if (!container || !inner) return;
    try {
      const origOverflow = container.style.overflow;
      container.style.overflow = 'visible';
      const canvas = await html2canvas(inner, { backgroundColor: null, scale: 2, useCORS: true, logging: false, width: inner.scrollWidth, height: inner.scrollHeight });
      container.style.overflow = origOverflow;
      const link = document.createElement('a');
      link.download = `age-gantt-${format(new Date(), 'yyyy-MM-dd')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) { console.error('Export failed:', err); }
  }, []);

  const toggleCompare = (id) => {
    if (compareIds.includes(id)) setCompareIds(compareIds.filter(i => i !== id));
    else if (compareIds.length < 4) setCompareIds([...compareIds, id]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* ═══ Birthdays ═══ */}
      {upcomingBirthdays.length > 0 && (
        <div className="zen-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Cake className="w-4 h-4 text-pink-500" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">Upcoming Birthdays</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {upcomingBirthdays.map(bd => {
              const color = PERSON_COLORS[bd.colorIndex % PERSON_COLORS.length];
              return (
                <div key={`${bd.personId}-${bd.nextBday.getTime()}`} className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs" style={{ backgroundColor: color.light }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color.bar }} />
                  <span className="font-medium text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">{bd.name}</span>
                  {bd.daysUntil === 0 ? <span className="font-bold text-pink-500">🎉 Today!</span>
                    : <span className="text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">in {bd.daysUntil}d ({format(bd.nextBday, 'dd MMM')})</span>}
                  <ChevronRight className="w-3 h-3 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]" />
                  <span className="text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">turning {bd.age}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ Life Reflection ═══ */}
      {lifeReflections && lifeReflections.matches.length > 0 && (
        <div className="zen-card p-4 border-l-4" style={{ borderLeftColor: '#B8634A' }}>
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-rose-500" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">Life Reflection — You've lived {lifeReflections.viewerAge} years</h3>
          </div>
          <p className="text-xs text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] mb-3">
            {lifeReflections.viewerName}, here are people who lived about the same age as you.
            {lifeReflections.viewerAge >= 50 ? " You've walked a long path — be grateful for every step." : lifeReflections.viewerAge >= 30 ? " You've reached an age many never saw. That is a gift." : " Every year is a privilege. These lives remind us to cherish each one."}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {lifeReflections.matches.map(m => {
              const outlived = m.lifespanYears <= lifeReflections.viewerAge;
              return (
                <div key={m.name} className={`rounded-md p-2.5 text-xs ${outlived ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
                  <div className="font-semibold text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">{m.name}</div>
                  <div className="text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">{m.birth} — {m.death}</div>
                  <div className="mt-1">{outlived ? <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Outlived by {m.yearsDiff}y</span> : <span className="text-amber-600 dark:text-amber-400 font-medium">✦ {m.yearsDiff}y away</span>}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ Time to Target ═══ */}
      {timeTargets.length > 0 && (
        <div className="zen-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">Time to Target</h3>
          </div>
          <div className="space-y-2">
            {timeTargets.map(t => {
              const color = PERSON_COLORS[t.colorIndex % PERSON_COLORS.length];
              return (
                <div key={t.personId} className="flex items-center gap-3 px-3 py-2 rounded-md text-xs" style={{ backgroundColor: color.light }}>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color.bar }} />
                  <span className="font-medium shrink-0 text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">{t.name}</span>
                  {t.surpassed ? <span className="text-emerald-600 dark:text-emerald-400">✓ Surpassed ({t.targetAge}y) by {t.surpassedData?.years || 0}y {t.surpassedData?.months || 0}m</span>
                    : t.remaining ? <span className="text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]"><span className="font-semibold text-amber-600 dark:text-amber-400">{t.remaining.years}y {t.remaining.months}m {t.remaining.days}d</span> left to reach {t.name}'s age ({t.targetAge}y)</span> : null}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ Controls ═══ */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
          {people.length} Person{people.length !== 1 ? 's' : ''}
          {lifespanStats && <span className="ml-2 font-normal lowercase">(avg {lifespanStats.avg}y)</span>}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          {people.length >= 2 && (
            <button onClick={() => setShowLifeClock(!showLifeClock)}
              className="flex items-center gap-1.5 zen-btn-secondary px-3 py-1.5 text-xs">
              <PieChart className="w-3.5 h-3.5" /> Life Clock
            </button>
          )}
          {people.length >= 2 && (
            <button onClick={() => setShowComparison(!showComparison)}
              className="flex items-center gap-1.5 zen-btn-secondary px-3 py-1.5 text-xs">
              <ArrowLeftRight className="w-3.5 h-3.5" /> Compare
            </button>
          )}
          <button onClick={shareConfig} className="flex items-center gap-1.5 zen-btn-secondary px-3 py-1.5 text-xs">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button onClick={() => setShowCustom(!showCustom)} className="flex items-center gap-1.5 zen-btn-secondary px-3 py-1.5 text-xs">
            <UserPlus className="w-3.5 h-3.5" /> Custom
          </button>
          <button onClick={addRandomFamousPerson}
            className="flex items-center gap-1.5 zen-btn-secondary px-3 py-1.5 text-xs">
            <Shuffle className="w-3.5 h-3.5" /> Random
          </button>
          <button onClick={() => setShowFamous(!showFamous)} className="flex items-center gap-1.5 zen-btn-secondary px-3 py-1.5 text-xs">
            <Bookmark className="w-3.5 h-3.5" /> Famous
          </button>
          <button onClick={addPerson} className="flex items-center gap-1.5 zen-btn-primary px-3 py-1.5 text-xs">
            <Plus className="w-3.5 h-3.5" /> Add Person
          </button>
        </div>
      </div>

      {/* Share message toast */}
      {shareMsg && <div className="text-xs text-center text-emerald-600 dark:text-emerald-400 animate-fade-up">{shareMsg}</div>}

      {/* ═══ Life Clock ═══ */}
      {showLifeClock && lifeClockData && (
        <div className="zen-card p-4 animate-fade-up">
          <div className="flex items-center gap-2 mb-3">
            <PieChart className="w-4 h-4 text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">Life Clock — Proportional Lifespan View</h3>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* SVG donut chart */}
            <div className="shrink-0">
              <svg width="220" height="220" viewBox="0 0 220 220">
                <circle cx="110" cy="110" r="90" fill="none" stroke="var(--color-zen-border-light)" strokeWidth="28" className="dark:opacity-30" />
                {(() => {
                  let cumPct = 0;
                  const totalYears = lifeClockData.reduce((s, d) => s + d.years, 0);
                  return lifeClockData.map(d => {
                    const pct = (d.years / totalYears) * 100;
                    const angle = (cumPct / 100) * 360;
                    const arcLen = (pct / 100) * 360;
                    cumPct += pct;
                    const r = 90;
                    const cx = 110, cy = 110;
                    const startAngle = (angle - 90) * Math.PI / 180;
                    const endAngle = (angle + arcLen - 90) * Math.PI / 180;
                    const x1 = cx + r * Math.cos(startAngle);
                    const y1 = cy + r * Math.sin(startAngle);
                    const x2 = cx + r * Math.cos(endAngle);
                    const y2 = cy + r * Math.sin(endAngle);
                    const largeArc = arcLen > 180 ? 1 : 0;
                    const path = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
                    return <path key={d.name} d={path} fill="none" stroke={d.color.bar} strokeWidth="28" strokeLinecap="butt" className="transition-all duration-500" />;
                  });
                })()}
                <circle cx="110" cy="110" r="65" fill="var(--color-zen-card-light)" className="dark:fill-[var(--color-zen-card-dark)]" />
                <text x="110" y="104" textAnchor="middle" className="fill-[var(--color-zen-text-light)] dark:fill-[var(--color-zen-text-dark)]" fontSize="20" fontWeight="bold">{lifeClockData.length}</text>
                <text x="110" y="122" textAnchor="middle" className="fill-[var(--color-zen-muted-light)] dark:fill-[var(--color-zen-muted-dark)]" fontSize="10">people</text>
              </svg>
            </div>
            {/* Legend */}
            <div className="flex-1 space-y-1.5 w-full">
              {lifeClockData.map(d => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded shrink-0" style={{ backgroundColor: d.color.bar }} />
                  <span className="font-medium text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">{d.name}</span>
                  <span className="text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">{d.years}y ({Math.round(d.pct)}%)</span>
                  <div className="flex-1 h-2 rounded-full bg-[var(--color-zen-border-light)] dark:bg-[var(--color-zen-border-dark)] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${d.pct}%`, backgroundColor: d.color.bar }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Famous People Library ═══ */}
      {showFamous && (
        <div className="zen-card p-3 animate-fade-up">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">Famous People Library ({FAMOUS_WITH_AGE.length})</h3>
          </div>
          {/* Age range filter */}
          <div className="flex flex-wrap gap-1 mb-2">
            {AGE_RANGES.map(r => (
              <button key={r.key} onClick={() => setFamousAgeFilter(r.key)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-all ${famousAgeFilter === r.key
                  ? 'bg-[var(--color-zen-accent-primary-light)] dark:bg-[var(--color-zen-accent-primary-dark)] text-white'
                  : 'bg-[var(--color-zen-border-light)] dark:bg-[var(--color-zen-border-dark)] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:opacity-80'}`}>
                {r.label}
              </button>
            ))}
          </div>
          {/* Region filter */}
          <div className="flex flex-wrap gap-1 mb-2">
            {REGION_RANGES.map(r => (
              <button key={r.key} onClick={() => setFamousRegionFilter(r.key)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-all ${famousRegionFilter === r.key
                  ? 'bg-[var(--color-zen-accent-primary-light)] dark:bg-[var(--color-zen-accent-primary-dark)] text-white'
                  : 'bg-[var(--color-zen-border-light)] dark:bg-[var(--color-zen-border-dark)] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:opacity-80'}`}>
                {r.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mb-2">
            <input type="text" placeholder="Search by name or description..." value={famousQuery}
              onChange={(e) => setFamousQuery(e.target.value)} className="zen-input w-full text-xs" autoFocus />
            <button onClick={addRandomFamousPerson}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)] whitespace-nowrap transition-all">
              <Shuffle className="w-3 h-3" /> Random
            </button>
          </div>
          <div className="max-h-52 overflow-y-auto space-y-0.5">
            {filteredFamous.map(fp => (
              <button key={fp.name} onClick={() => addFamousPerson(fp)}
                className="w-full text-left flex items-center justify-between px-3 py-2 rounded-md text-xs hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)] transition-all group">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">{fp.name}</span>
                    {fp.lifespanYears && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-zen-border-light)] dark:bg-[var(--color-zen-border-dark)] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">{fp.lifespanYears}y</span>}
                  </div>
                  <p className="text-[10px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] mt-0.5">{fp.birth} — {fp.death} · {fp.desc} · {fp.region}</p>
                </div>
                <Plus className="w-3 h-3 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
              </button>
            ))}
          </div>
          {filteredFamous.length === 0 && <p className="text-xs text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] text-center py-3">No matches found</p>}
        </div>
      )}

      {/* ═══ Custom Person ═══ */}
      {showCustom && (
        <div className="zen-card p-3 animate-fade-up">
          <div className="flex items-center gap-2 mb-3">
            <UserPlus className="w-4 h-4 text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">Custom Person</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
            <input type="text" placeholder="Name (e.g., My Grandfather)" value={customPerson.name}
              onChange={(e) => setCustomPerson({ ...customPerson, name: e.target.value })} className="zen-input text-xs py-1.5 px-2" />
            <input type="date" value={customPerson.birth}
              onChange={(e) => setCustomPerson({ ...customPerson, birth: e.target.value })} className="zen-input text-xs py-1.5 px-2" />
            <input type="date" value={customPerson.death}
              onChange={(e) => setCustomPerson({ ...customPerson, death: e.target.value })} className="zen-input text-xs py-1.5 px-2" />
          </div>
          <button onClick={addCustomPerson} disabled={!customPerson.name.trim() || !customPerson.birth || !customPerson.death}
            className="zen-btn-primary px-3 py-1.5 text-xs disabled:opacity-40">
            <Plus className="w-3.5 h-3.5 inline mr-1" /> Add to List
          </button>
        </div>
      )}

      {/* ═══ Comparison ═══ */}
      {showComparison && people.length >= 2 && (
        <div className="zen-card p-3 animate-fade-up">
          <div className="flex items-center gap-2 mb-3">
            <ArrowLeftRight className="w-4 h-4 text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">Age Comparison</h3>
            <span className="text-[10px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">(click up to 4)</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {peopleData.map(p => (
              <button key={p.id} onClick={() => toggleCompare(p.id)}
                className={`px-2.5 py-1 rounded-md text-xs border transition-all ${compareIds.includes(p.id) ? 'border-transparent font-semibold text-white' : 'border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]'}`}
                style={compareIds.includes(p.id) ? { backgroundColor: p.color.bar } : {}}>
                {p.name} {p.age ? `(${p.age.years}y)` : ''}
              </button>
            ))}
          </div>
          {comparisonData && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)]">
                    <th className="text-left py-1.5 pr-3 font-semibold text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">Measure</th>
                    {comparisonData.map(p => <th key={p.id} className="text-center py-1.5 px-2 font-semibold" style={{ color: p.color.bar }}>{p.name}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[{ label: 'Born', get: (p) => format(new Date(p.startDate), 'dd MMM yyyy') }, { label: 'End', get: (p) => format(new Date(p.endDate), 'dd MMM yyyy') }, { label: 'Years', get: (p) => p.age?.years ?? '—' }, { label: 'Months', get: (p) => p.age?.months ?? '—' }, { label: 'Days', get: (p) => p.age?.days ?? '—' }, { label: 'Total Days', get: (p) => p.age?.totalDays?.toLocaleString() ?? '—' }].map(row => (
                    <tr key={row.label} className="border-b border-[var(--color-zen-border-light)]/50 dark:border-[var(--color-zen-border-dark)]/50">
                      <td className="py-1.5 pr-3 font-medium text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">{row.label}</td>
                      {comparisonData.map(p => <td key={p.id} className="text-center py-1.5 px-2 text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">{row.get(p)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ═══ Person Cards ═══ */}
      <div className="grid md:grid-cols-2 gap-3">
        {peopleData.map((person) => {
          const color = person.color;
          return (
            <div key={person.id} className="zen-card p-4 relative group hover:shadow-md transition-all" style={{ borderLeftColor: color.bar, borderLeftWidth: '3px' }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: color.light }}>
                  <User className="w-4 h-4" style={{ color: color.bar }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <input type="text" value={person.name}
                      onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
                      className="bg-transparent border-none text-sm font-semibold focus:ring-0 p-0 w-full text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]" />
                    {people.length > 1 && (
                      <button onClick={() => removePerson(person.id)}
                        className="p-1 shrink-0 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-wider shrink-0 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">From</span>
                    <input type="date" value={person.startDate}
                      onChange={(e) => updatePerson(person.id, 'startDate', e.target.value)} className="zen-input text-xs py-1 px-2 w-full" />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-medium uppercase tracking-wider shrink-0 text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">To</span>
                    <input type="date" value={person.endDate}
                      onChange={(e) => updatePerson(person.id, 'endDate', e.target.value)} className="zen-input text-xs py-1 px-2 w-full" />
                  </div>
                  {person.age ? (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      <div className="rounded-md text-center py-2" style={{ backgroundColor: color.light }}>
                        <div className="text-sm font-bold" style={{ color: color.bar }}>{person.age.years}</div>
                        <div className="text-[9px] font-semibold uppercase tracking-wider text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">Years</div>
                      </div>
                      <div className="rounded-md text-center py-2" style={{ backgroundColor: color.light }}>
                        <div className="text-sm font-bold" style={{ color: color.bar }}>{person.age.months}</div>
                        <div className="text-[9px] font-semibold uppercase tracking-wider text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">Months</div>
                      </div>
                      <div className="rounded-md text-center py-2" style={{ backgroundColor: color.light }}>
                        <div className="text-sm font-bold" style={{ color: color.bar }}>{person.age.days}</div>
                        <div className="text-[9px] font-semibold uppercase tracking-wider text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">Days</div>
                      </div>
                      <div className="rounded-md text-center py-2" style={{ backgroundColor: color.light }}>
                        <div className="text-sm font-bold" style={{ color: color.bar }}>{person.age.totalDays.toLocaleString()}</div>
                        <div className="text-[9px] font-semibold uppercase tracking-wider text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">Total</div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 text-xs italic text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
                      {new Date(person.startDate) > new Date(person.endDate) ? 'Start must be before end' : 'Invalid date'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══ Stats ═══ */}
      {lifespanStats && (
        <div className="zen-card p-3">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">Lifespan Statistics</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="rounded-md p-2.5 bg-emerald-50 dark:bg-emerald-900/20">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">Max</div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{lifespanStats.max}y</div>
              {lifespanStats.maxPerson && <div className="text-[10px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] truncate">{lifespanStats.maxPerson.name}</div>}
            </div>
            <div className="rounded-md p-2.5 bg-rose-50 dark:bg-rose-900/20">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">Min</div>
              <div className="font-bold text-rose-600 dark:text-rose-400 mt-0.5">{lifespanStats.min}y</div>
              {lifespanStats.minPerson && <div className="text-[10px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] truncate">{lifespanStats.minPerson.name}</div>}
            </div>
            <div className="rounded-md p-2.5 bg-blue-50 dark:bg-blue-900/20">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">Average</div>
              <div className="font-bold text-blue-600 dark:text-blue-400 mt-0.5">{lifespanStats.avg}y</div>
              <div className="text-[10px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">across {lifespanStats.count}</div>
            </div>
            <div className="rounded-md p-2.5 bg-purple-50 dark:bg-purple-900/20">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">Median</div>
              <div className="font-bold text-purple-600 dark:text-purple-400 mt-0.5">{lifespanStats.median}y</div>
              <div className="text-[10px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">middle value</div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Gantt Chart ═══ */}
      {allDates && peopleData.some(p => p.age) && (
        <div className="zen-card overflow-hidden">
          <div className="p-4 border-b border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChartHorizontal className="w-4 h-4 text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">Lifespan Gantt Chart</h3>
            </div>
            <button onClick={exportGanttAsPNG}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-medium border border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)] transition-all">
              <Download className="w-3 h-3" /> Export PNG
            </button>
          </div>
          <div className="overflow-x-auto" ref={ganttRef}>
            <div ref={ganttInnerRef}>
              <div className="min-w-[600px] p-4">
                <div className="flex mb-3">
                  <div className="w-[140px] shrink-0 pr-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">Person</span>
                  </div>
                  <div className="flex-1 relative h-6">
                    {chartStart && chartEnd && (() => {
                      const markers = [];
                      const totalMonths = differenceInMonths(chartEnd, chartStart);
                      const step = Math.max(1, Math.floor(totalMonths / 10));
                      for (let i = 0; i <= totalMonths; i += step) {
                        const d = new Date(chartStart);
                        d.setMonth(d.getMonth() + i);
                        const pct = (differenceInDays(d, chartStart) / totalSpan) * 100;
                        if (pct <= 100) markers.push(
                          <div key={i} className="absolute top-0 text-[9px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] -translate-x-1/2" style={{ left: `${pct}%` }}>
                            {format(d, 'MMM yy')}
                          </div>
                        );
                      }
                      return markers;
                    })()}
                  </div>
                </div>
                <div className="space-y-2">
                  {peopleData.filter(p => p.age).map((person) => {
                    const color = person.color;
                    const left = getLeftPct(person.startDate);
                    const width = getWidthPct(person.startDate, person.endDate);
                    return (
                      <div key={person.id} className="flex items-center group">
                        <div className="w-[140px] shrink-0 pr-3 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color.bar }} />
                          <span className="text-xs font-medium text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)] truncate">{person.name}</span>
                        </div>
                        <div className="flex-1 relative h-9">
                          <div className="absolute inset-0 rounded-md" style={{ backgroundColor: 'var(--color-zen-bg-light)', opacity: 0.5 }} />
                          <div className="absolute top-1/2 -translate-y-1/2 h-6 rounded-md shadow-sm transition-all group-hover:shadow-md group-hover:h-7 flex items-center"
                            style={{ left: `${left}%`, width: `max(2%, ${width}%)`, backgroundColor: color.bar, opacity: 0.85 }}>
                            {width > 8 && <span className="text-[9px] font-medium text-white px-2 truncate">{person.age.years}y {person.age.months}m ({person.age.totalDays.toLocaleString()}d)</span>}
                          </div>
                          <div className="absolute -bottom-4 left-0 right-0 flex justify-between text-[8px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>{format(new Date(person.startDate), 'dd MMM yyyy')}</span>
                            <span>{format(new Date(person.endDate), 'dd MMM yyyy')}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)]">
                  <div className="flex items-center text-[10px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
                    <span className="w-[140px] shrink-0">Total span</span>
                    <span>{format(chartStart, 'dd MMM yyyy')} — {format(chartEnd, 'dd MMM yyyy')} ({totalSpan.toLocaleString()} days)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-[10px] text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)]">
        Data auto-saved locally &middot; {people.length} person{people.length !== 1 ? 's' : ''} &middot; {FAMOUS_WITH_AGE.length} famous presets
      </div>
    </div>
  );
}
