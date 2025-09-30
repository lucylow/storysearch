import json
import random
from datetime import datetime, timedelta

def generate_nike_data():
    data = []
    base_date = datetime(2025, 9, 15)

    # Products
    products = [
        {"name": "Nike Air Zoom Pegasus 40", "description": "Responsive cushioning for everyday runs.", "tags": ["running", "shoes", "performance"], "categories": ["footwear", "men", "women"]},
        {"name": "Nike Dri-FIT ADV Techknit Ultra", "description": "Lightweight, breathable running top.", "tags": ["apparel", "running", "dri-fit"], "categories": ["apparel", "men"]},
        {"name": "Nike Sportswear Tech Fleece Hoodie", "description": "Premium warmth without the weight.", "tags": ["hoodie", "fleece", "casual"], "categories": ["apparel", "men", "women"]},
        {"name": "Nike Air Force 1 '07", "description": "Classic style, modern comfort.", "tags": ["sneakers", "lifestyle", "classic"], "categories": ["footwear", "men", "women"]},
        {"name": "Nike Yoga Dri-FIT Pants", "description": "Soft, flexible fabric for your practice.", "tags": ["yoga", "pants", "comfort"], "categories": ["apparel", "women"]}
    ]

    for i, prod in enumerate(products):
        date = base_date - timedelta(days=random.randint(1, 30))
        data.append({
            "id": f"nike-product-{i+1}",
            "title": prod["name"],
            "slug": prod["name"].lower().replace(" ", "-").replace("'", ""),
            "content_type": "product",
            "description": prod["description"],
            "full_text_content": f"Discover the {prod['name']} with its {prod['description'].lower()} Perfect for {random.choice(['athletes', 'daily wear', 'training'])}. Shop now and experience Nike innovation.",
            "image_url": f"https://example.com/nike/product-{i+1}.jpg",
            "url": f"https://www.nike.com/product/{prod['name'].lower().replace(' ', '-')}",
            "tags": prod["tags"] + ["nike", "sportswear"],
            "categories": prod["categories"] + ["nike"],
            "related_entities": ["Nike", "Just Do It"],
            "brand_or_person": "Nike",
            "date_published": date.strftime("%Y-%m-%d"),
            "author": "Nike Marketing",
            "sentiment": random.choice(["positive", "neutral"]),
            "ai_summary": f"A detailed overview of the {prod['name']}, highlighting its features and benefits for {random.choice(['performance', 'style', 'comfort'])}."
        })

    # Campaigns/Articles
    campaigns = [
        {"name": "Just Do It: The Power of Sport", "description": "Inspiring athletes worldwide.", "tags": ["campaign", "inspiration", "sport"], "content": "The iconic 'Just Do It' campaign continues to motivate generations. This article explores its enduring legacy and impact on sports culture, featuring stories of perseverance and triumph. Nike believes in the power of sport to unite and inspire, pushing boundaries and achieving greatness. From grassroots initiatives to global events, Nike champions athletes at every level, fostering a community dedicated to pushing limits. The campaign highlights how sport can transform lives, building character and resilience. It's more than just a slogan; it's a philosophy that encourages everyone to embrace challenges and strive for their personal best. Nike's commitment to innovation in athletic wear supports this vision, providing tools for athletes to perform at their peak. Join the movement and discover your own potential, because in the world of sport, anything is possible if you just do it."},
        {"name": "Why Do It? Connecting with the Next Generation", "description": "Nike's latest campaign for young athletes.", "tags": ["campaign", "youth", "motivation"], "content": "'Why Do It?' is Nike's fresh take on inspiring young athletes. This campaign delves into the personal motivations behind pursuing sport, encouraging self-discovery and passion. It features emerging talents sharing their journeys, challenges, and the joy they find in their respective disciplines. Nike aims to foster a deeper connection with the youth, understanding their unique perspectives and aspirations. The narrative emphasizes that the 'why' behind participation is as crucial as the 'what,' promoting a holistic approach to athletic development. Through compelling storytelling and vibrant visuals, the campaign showcases the diverse reasons individuals engage in sport, from personal growth to community building. It's a celebration of individuality and the collective spirit of athleticism, inviting the next generation to define their own path with Nike."},
        {"name": "Winning Isn't for Everyone: Celebrating Effort", "description": "Focusing on the journey, not just the outcome.", "tags": ["campaign", "effort", "journey"], "content": "'Winning Isn't for Everyone' is a powerful campaign that shifts focus from victory to the invaluable effort and dedication involved in sports. It celebrates the grind, the setbacks, and the relentless pursuit of improvement, recognizing that true success lies in the journey itself. Featuring a diverse roster of athletes, the campaign highlights their struggles and triumphs, emphasizing that every step forward, regardless of the final score, is a win. Nike promotes a culture where resilience and passion are paramount, encouraging athletes to embrace challenges and learn from every experience. This narrative resonates deeply, reminding us that the spirit of sport is found in the commitment to personal excellence and the courage to keep going, even when the odds are stacked against you. It's a testament to the idea that effort, not just outcome, defines an athlete's legacy."}
    ]

    for i, camp in enumerate(campaigns):
        date = base_date - timedelta(days=random.randint(31, 90))
        data.append({
            "id": f"nike-campaign-{i+1}",
            "title": camp["name"],
            "slug": camp["name"].lower().replace(" ", "-").replace("'", "").replace(":", ""),
            "content_type": "campaign",
            "description": camp["description"],
            "full_text_content": camp["content"],
            "image_url": f"https://example.com/nike/campaign-{i+1}.jpg",
            "url": f"https://about.nike.com/newsroom/campaigns/{camp['name'].lower().replace(' ', '-')}",
            "tags": camp["tags"] + ["nike", "marketing"],
            "categories": ["marketing", "news"],
            "related_entities": ["Nike", "Athletes", "Inspiration"],
            "brand_or_person": "Nike",
            "date_published": date.strftime("%Y-%m-%d"),
            "author": "Nike Newsroom",
            "sentiment": "positive",
            "ai_summary": f"An in-depth look at Nike's '{camp['name']}' campaign, exploring its message and impact on global sports culture."
        })

    return data

def generate_ishowspeed_data():
    data = []
    base_date = datetime(2025, 9, 20)

    # Videos/Streams
    videos = [
        {"name": "iShowSpeed Plays FIFA 25 - INSANE GOALS!", "description": "Speed's epic FIFA 25 gameplay highlights.", "tags": ["gaming", "fifa", "livestream"], "content": "Watch iShowSpeed's most electrifying moments from his recent FIFA 25 stream. From impossible goals to hilarious reactions, this compilation has it all. Speed showcases his unique blend of skill and entertainment, keeping viewers on the edge of their seats. The stream was filled with fan interactions, unexpected plays, and his signature high-energy commentary. Relive the excitement and see why millions tune in to watch Speed's gaming sessions. His passion for FIFA is evident in every match, making even routine plays feel like monumental events. Don't miss out on the action and subscribe for more gaming content!"},
        {"name": "Reacting to Viral TikToks - iShowSpeed Edition", "description": "Speed reacts to the funniest and wildest TikToks.", "tags": ["reaction", "tiktok", "comedy"], "content": "iShowSpeed dives into the world of viral TikToks, offering his unfiltered and hilarious reactions. Prepare for genuine shock, uncontrollable laughter, and classic Speed commentary as he navigates through the internet's most trending clips. This video captures his authentic personality, making even mundane content entertaining. From dance challenges to bizarre skits, Speed's reactions are always a highlight, providing a fresh perspective on popular culture. Join him on this journey through the digital landscape and see which TikToks make him scream, laugh, or simply speechless. It's a rollercoaster of emotions that only iShowSpeed can deliver, guaranteeing a good time for all viewers."},
        {"name": "My Trip to Japan - iShowSpeed Vlog", "description": "Exploring Tokyo and experiencing Japanese culture.", "tags": ["vlog", "travel", "japan"], "content": "Join iShowSpeed on an unforgettable adventure through Japan! This vlog captures his experiences exploring the vibrant streets of Tokyo, trying exotic foods, and interacting with fans. From iconic landmarks to hidden gems, Speed shares his unique perspective on Japanese culture. The video is packed with his usual energy, humor, and spontaneous moments that make his content so engaging. Witness his reactions to everything from traditional temples to futuristic technology, all while bringing his signature charm. It's a cultural immersion mixed with pure entertainment, offering viewers a glimpse into his global travels. Get ready for a wild ride as Speed takes on Japan!"}
    ]

    for i, vid in enumerate(videos):
        date = base_date - timedelta(days=random.randint(1, 60))
        data.append({
            "id": f"ishowspeed-video-{i+1}",
            "title": vid["name"],
            "slug": vid["name"].lower().replace(" ", "-").replace("'", "").replace(":", ""),
            "content_type": "video",
            "description": vid["description"],
            "full_text_content": vid["content"],
            "image_url": f"https://example.com/ishowspeed/video-{i+1}.jpg",
            "url": f"https://www.youtube.com/watch?v=ishowspeed{i+1}",
            "tags": vid["tags"] + ["ishowspeed", "youtube", "streamer"],
            "categories": ["entertainment", "gaming", "vlog"],
            "related_entities": ["iShowSpeed", "YouTube", "Cristiano Ronaldo"],
            "brand_or_person": "iShowSpeed",
            "date_published": date.strftime("%Y-%m-%d"),
            "author": "iShowSpeed",
            "sentiment": random.choice(["positive", "neutral"]),
            "ai_summary": f"Highlights from iShowSpeed's latest content, showcasing his energetic personality and engaging {random.choice(['gameplay', 'reactions', 'travel adventures'])}."
        })

    return data

def generate_blackpink_data():
    data = []
    base_date = datetime(2025, 9, 10)

    # Music Releases
    music_releases = [
        {"name": "BORN PINK (Album)", "description": "BLACKPINK's second studio album.", "tags": ["album", "kpop", "music"], "content": "'BORN PINK' is BLACKPINK's highly anticipated second studio album, featuring a blend of powerful anthems and emotional ballads. This album showcases the group's versatility and growth, with each member contributing their unique artistry. Tracks like 'Pink Venom' and 'Shut Down' highlight their signature fierce style, while other songs explore new sonic territories. The album's production is top-notch, combining intricate beats with captivating melodies, making it a global sensation. Fans praise the album for its strong vocals, dynamic rap verses, and visually stunning music videos. 'BORN PINK' solidifies BLACKPINK's status as a leading force in the global music industry, breaking records and captivating audiences worldwide."},
        {"name": "Pink Venom (Single)", "description": "Lead single from BORN PINK.", "tags": ["single", "kpop", "music"], "content": "'Pink Venom' is the explosive pre-release single from BLACKPINK's 'BORN PINK' album, immediately captivating listeners with its unique sound and powerful visuals. The track blends traditional Korean instruments with modern hip-hop beats, creating a distinct and memorable sonic experience. Lyrically, it's a declaration of confidence and strength, perfectly embodying BLACKPINK's fierce image. The music video broke multiple records, showcasing intricate choreography, stunning outfits, and the members' undeniable charisma. 'Pink Venom' served as a perfect prelude to the album, generating immense excitement and setting a high bar for their comeback. It's a testament to BLACKPINK's ability to innovate and dominate the global music scene."},
        {"name": "THE ALBUM (Album)", "description": "BLACKPINK's first full-length studio album.", "tags": ["album", "kpop", "music"], "content": "'THE ALBUM' marked BLACKPINK's highly successful foray into a full-length studio release, featuring global hits like 'How You Like That' and 'Lovesick Girls.' This album solidified their international presence, showcasing their unique blend of pop, hip-hop, and EDM. Each track is meticulously crafted, highlighting the members' vocal prowess and rap skills. The album's themes revolve around love, empowerment, and self-discovery, resonating with a diverse audience. With collaborations and innovative production, 'THE ALBUM' became a commercial and critical success, breaking numerous records and earning them a dedicated fanbase worldwide. It's a landmark release that defined a new era for BLACKPINK and K-pop."}
    ]

    for i, release in enumerate(music_releases):
        date = base_date - timedelta(days=random.randint(1, 120))
        data.append({
            "id": f"blackpink-music-{i+1}",
            "title": release["name"],
            "slug": release["name"].lower().replace(" ", "-").replace("'", "").replace("(", "").replace(")", ""),
            "content_type": "music_release",
            "description": release["description"],
            "full_text_content": release["content"],
            "image_url": f"https://example.com/blackpink/music-{i+1}.jpg",
            "url": f"https://www.blackpinkmusic.com/release/{release['name'].lower().replace(' ', '-')}",
            "tags": release["tags"] + ["blackpink", "yg entertainment"],
            "categories": ["music", "k-pop"],
            "related_entities": ["BLACKPINK", "Jisoo", "Jennie", "Rosé", "Lisa"],
            "brand_or_person": "BLACKPINK",
            "date_published": date.strftime("%Y-%m-%d"),
            "author": "YG Entertainment",
            "sentiment": "positive",
            "ai_summary": f"An overview of BLACKPINK's '{release['name']}', detailing its impact and key tracks."
        })

    # Brand Endorsements
    endorsements = [
        {"name": "Jennie for Chanel", "description": "Global Ambassador for Chanel.", "tags": ["fashion", "luxury", "ambassador"], "content": "Jennie Kim, a member of BLACKPINK, serves as a global ambassador for the luxury fashion house Chanel. Her sophisticated style and influential presence perfectly align with Chanel's elegant image. This partnership has led to numerous campaigns, photoshoots, and appearances at high-profile fashion events, solidifying her status as a fashion icon. Jennie's collaboration with Chanel extends beyond mere endorsement; she embodies the brand's spirit, bringing a fresh, modern appeal to its classic designs. Her impact on fashion trends is undeniable, making her a sought-after figure in the industry. The synergy between Jennie and Chanel highlights the power of K-pop stars in shaping global fashion narratives."},
        {"name": "Lisa for Celine", "description": "Global Ambassador for Celine.", "tags": ["fashion", "luxury", "ambassador"], "content": "Lisa Manobal, BLACKPINK's main dancer and rapper, is a global ambassador for the French luxury brand Celine. Known for her edgy and chic style, Lisa brings a contemporary flair to Celine's collections. Her involvement has significantly boosted the brand's visibility and appeal, especially among younger demographics in Asia and beyond. Lisa's fashion choices are closely watched, and her association with Celine has made the brand a staple in modern luxury fashion. She frequently features in Celine's campaigns and attends their fashion shows, showcasing the brand's latest designs with her unique charisma. This partnership underscores Lisa's immense influence in the fashion world and her ability to drive global trends."},
        {"name": "Jisoo for Dior", "description": "Global Ambassador for Dior Fashion and Beauty.", "tags": ["fashion", "beauty", "luxury", "ambassador"], "content": "Jisoo, BLACKPINK's vocalist and visual, is a global ambassador for Dior, representing both their fashion and beauty lines. Her classic elegance and graceful demeanor perfectly complement Dior's timeless sophistication. Jisoo's campaigns for Dior have been widely acclaimed, showcasing her versatility and ability to embody the brand's diverse aesthetics. She is a prominent figure at Dior's fashion shows and events, often seen wearing their latest creations. This partnership highlights Jisoo's status as a style icon and her significant impact on the luxury market. Her influence helps bridge the gap between traditional luxury and contemporary pop culture, making Dior more accessible and appealing to a global audience."}
    ]

    for i, endorse in enumerate(endorsements):
        date = base_date - timedelta(days=random.randint(60, 180))
        data.append({
            "id": f"blackpink-endorsement-{i+1}",
            "title": endorse["name"],
            "slug": endorse["name"].lower().replace(" ", "-").replace("'", "").replace(":", ""),
            "content_type": "brand_endorsement",
            "description": endorse["description"],
            "full_text_content": endorse["content"],
            "image_url": f"https://example.com/blackpink/endorsement-{i+1}.jpg",
            "url": f"https://www.vogue.com/article/blackpink-{endorse['name'].lower().replace(' ', '-')}",
            "tags": endorse["tags"] + ["blackpink", "k-pop", "fashion"],
            "categories": ["fashion", "luxury", "celebrity"],
            "related_entities": ["BLACKPINK", "Chanel", "Celine", "Dior", "Jennie", "Lisa", "Jisoo"],
            "brand_or_person": "BLACKPINK",
            "date_published": date.strftime("%Y-%m-%d"),
            "author": "Fashion Magazine",
            "sentiment": "positive",
            "ai_summary": f"An analysis of {endorse['name']}'s partnership, detailing its significance in the luxury fashion industry."
        })

    return data

def main():
    all_mock_data = []
    all_mock_data.extend(generate_nike_data())
    all_mock_data.extend(generate_ishowspeed_data())
    all_mock_data.extend(generate_blackpink_data())

    with open("mock_data.json", "w", encoding="utf-8") as f:
        json.dump(all_mock_data, f, indent=2, ensure_ascii=False)

    print("Mock data generated successfully to mock_data.json")

if __name__ == "__main__":
    main()
