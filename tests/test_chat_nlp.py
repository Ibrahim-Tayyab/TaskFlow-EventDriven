import requests
import json
import time

API_URL = "http://localhost:8000/api/chat"

def test_nlp_reminder():
    print("Testing NLP Reminder...")
    
    # 1. Send natural language request
    payload = {
        "messages": [
            {"role": "user", "content": "Remind me to Call Mom tomorrow at 10am"}
        ]
    }
    
    try:
        start = time.time()
        res = requests.post(API_URL, json=payload)
        print(f"Response time: {time.time() - start:.2f}s")
        
        if res.status_code != 200:
            print(f"Failed: {res.status_code} - {res.text}")
            return
            
        data = res.json()
        print(f"AI Response: {data['response']}")
        print(f"Source: {data['source']}")
        
        # 2. Verify Task Creation (by searching)
        
        if "Task Added" in data['response'] or "Created" in data['response']:
            print("NLP Task Creation Validation Passed")
        else:
            print("Response did not indicate task creation. Check logs.")
            
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    # Wait for backend to be ready
    print("Waiting for backend...")
    time.sleep(5) 
    test_nlp_reminder()
