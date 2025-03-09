import cv2
import numpy as np
import tensorflow.lite as tflite

# โหลดโมเดล TFLite
interpreter = tflite.Interpreter(model_path="TestOpencv/model_unquant.tflite")
interpreter.allocate_tensors()

# ดึงข้อมูลเกี่ยวกับ input และ output tensor
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# ฟังก์ชันสำหรับการจำแนกประเภทภาพ
def classify_image(frame):
    # ปรับขนาดภาพให้ตรงกับโมเดลที่ฝึกไว้ (224x224 ในกรณีนี้)
    img_resized = cv2.resize(frame, (224, 224))
    img_array = np.expand_dims(img_resized, axis=0).astype(np.float32) / 255.0

    # ใส่ข้อมูลเข้าโมเดล TFLite
    interpreter.set_tensor(input_details[0]['index'], img_array)
    interpreter.invoke()

    # ดึงผลลัพธ์จากโมเดล
    output_data = interpreter.get_tensor(output_details[0]['index'])
    prediction = output_data[0]  # สมมติว่าโมเดลทำนาย 3 คลาส: (QR สมบูรณ์, QR ไม่สมบูรณ์, พื้นหลัง)

    return prediction

# ฟังก์ชันสำหรับแสดงผลเปอร์เซ็นต์
def display_prediction(frame, prediction):
    # คำนวณเปอร์เซ็นต์ของความเป็นสมบูรณ์และไม่สมบูรณ์สำหรับ QR Code
    percentage_qr_complete = prediction[0] * 100  # เปอร์เซ็นต์ของการทำนายว่า QR Code สมบูรณ์
    percentage_qr_incomplete = prediction[1] * 100  # เปอร์เซ็นต์ของการทำนายว่า QR Code ไม่สมบูรณ์
    percentage_background = prediction[2] * 100  # เปอร์เซ็นต์ของการทำนายว่าเป็นพื้นหลัง

    # แสดงผลลัพธ์บนภาพ
    label = f"QR Complete: {percentage_qr_complete:.2f}% | QR Incomplete: {percentage_qr_incomplete:.2f}% | Background: {percentage_background:.2f}%"
    cv2.putText(frame, label, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    return frame

# เปิดกล้อง
cap = cv2.VideoCapture(1, cv2.CAP_DSHOW)  # ใช้ DirectShow แทน MSMF

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # จำแนกภาพจากกล้อง
    prediction = classify_image(frame)

    # แสดงผลลัพธ์ในรูปแบบเปอร์เซ็นต์
    frame = display_prediction(frame, prediction)

    # แสดงภาพ
    cv2.imshow("Image Classification", frame)

    # กด 'q' เพื่อออกจากโปรแกรม
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
