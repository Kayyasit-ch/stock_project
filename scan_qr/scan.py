import cv2
import time
import json
import requests  # เพิ่ม requests

# ตั้งค่า API URL
API_URL = "http://localhost:3000/api/products"  # เปลี่ยน URL ตาม API ของคุณ

# เปิดกล้อง
cap = cv2.VideoCapture(0)

# สร้างตัวแปร QRCodeDetector
detector = cv2.QRCodeDetector()

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # แปลงภาพเป็นขาวดำ
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # ตรวจจับ QR code จากภาพขาวดำ
    value, pts, qr_code = detector.detectAndDecode(gray_frame)

    if value:
        try:
            # แปลงค่าที่อ่านได้เป็น JSON
            json_data = json.loads(value)

            # ตรวจสอบว่ามีรหัสสินค้า (codeproduct) หรือไม่
            codeproduct = json_data.get("codeproduct")
            if codeproduct is not None:
                # แสดงข้อมูลสินค้า
                print(json.dumps(json_data, indent=2, ensure_ascii=False))

                # ส่ง POST ไปยัง API
                response = requests.post(API_URL, json=json_data)

                # แสดงผลลัพธ์จาก API
                print(f"Response: {response.status_code} - {response.text}")

                # วาดกรอบรอบ QR Code ที่ตรวจพบ
                if pts is not None:
                    pts = pts.astype(int)
                    frame = cv2.polylines(frame, [pts], isClosed=True, color=(0, 255, 0), thickness=5)

                # หน่วงเวลา 3 วินาทีป้องกันการสแกนซ้ำ
                time.sleep(3)

        except json.JSONDecodeError:
            # ถ้าไม่ใช่ JSON ให้ข้ามไปโดยไม่แสดงผล
            pass

    # แสดงผลภาพ
    cv2.imshow("QR Code Scanner", frame)

    # กด 'q' เพื่อออกจากการสแกน
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# ปิดกล้องและหน้าต่าง
cap.release()
cv2.destroyAllWindows()
