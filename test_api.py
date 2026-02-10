import requests
import json

def test_backend():
    print("Testing Backend Health...")
    try:
        r = requests.get('http://localhost:5000/health')
        print(f"Health Check: {r.status_code} - {r.json()}")
    except Exception as e:
        print(f"Health Check Failed: {e}")

    print("\nTesting Policy Generation...")
    payload = {
        "client_details": {
            "age": 35,
            "income": 70000,
            "lifestyle": "active",
            "medical_history": False
        },
        "insurance_details": {
            "type": "life",
            "coverage_amount": 200000
        }
    }
    try:
        r = requests.post('http://localhost:5000/api/policies/', json=payload)
        print(f"Policy Generation: {r.status_code}")
        if r.status_code == 201:
            data = r.json()
            print(f"Policy ID: {data.get('policy_id')}")
            print(f"Risk Score: {data.get('risk_assessment', {}).get('score')}")
            print(f"Monthly Premium: {data.get('pricing', {}).get('monthly_premium')}")
            print("Policy Generation SUCCESS")
        else:
            print(f"Policy Generation FAILED: {r.text}")
    except Exception as e:
        print(f"Policy Generation Request Failed: {e}")

def test_frontend():
    print("\nTesting Frontend Reachability...")
    try:
        r = requests.get('http://localhost:5173')
        print(f"Frontend: {r.status_code} - Reachable")
    except Exception as e:
        print(f"Frontend Reachability Failed: {e}")

if __name__ == "__main__":
    test_backend()
    test_frontend()
