import cv2
import cv2 as cv
import numpy as np
from firebase_admin import messaging
import firebase_admin
import datetime

cap = cv2.VideoCapture("MJ_Market.avi")
arr = np.load("test.npy", allow_pickle=True)
h = 0

# ret, prev = cap.read()
# prvs = cv.cvtColor(prev,cv.COLOR_BGR2GRAY)

while(cap.isOpened()):
	ret, frame = cap.read()
	if ret == True:
		for i in arr[h]:
			print(i)
			# print(( frame.shape[1]*i[1] , frame.shape[0] * abs(1 - i[0]) ))
			# print((frame.shape[1]*i[3] , frame.shape[0] *abs(1-i[2]) ))
			# frame  = cv2.rectangle(frame, ( int(frame.shape[1]*i[1]) , int(frame.shape[0] * abs(1 - i[0])) ) , (int(frame.shape[1]*i[3]) , int(frame.shape[0] *abs(1-i[2])) ) ,(255, 0, 0), 2)
			frame  = cv2.rectangle(frame, ( int(frame.shape[1]*i[1]) , int(frame.shape[0] * abs(i[0])) ) , (int(frame.shape[1]*i[3]) , int(frame.shape[0] *abs(i[2])) ) ,(255, 0, 0), 2)

			# frame  = cv2.rectangle(frame, (  int(i[1]), int(i[2])), (int(i[3]), int(i[0])) ,(255,0,0), 2 )
		cv2.imshow('Frame', frame)
		h+=1
		if cv2.waitKey(25) & 0xFF == ord('q'):
			break
		# ret, next = cap.read()
		# next = cv.cvtColor(next,cv.COLOR_BGR2GRAY)
		# flow = cv.calcOpticalFlowFarneback(prvs,next, None, 0.5, 3, 15, 3, 5, 1.2, 0)
		# mag, ang = cv.cartToPolar(flow[...,0], flow[...,1])
		# prev = next
		# cv2.imshow('Frame', mag)
		# if cv2.waitKey(25) & 0xFF == ord('q'):
		# 	break
	else:
		break
cap.release()

device_token = "cK1sRCbyRFiPEMSPMTynZ7:APA91bE_LzRpkl4VmrqpuGcPcqv1IFPxzbSL8rue0dO6pfGCn7UpYq1zBFA3Ym-gAuBzB9hfJtu8t0-LpGL0QCFvqmc7bzVmHLRpTg6SDzXPrkWOU9oUjc7AUozqHaR4XmtSgcrlBcSM"

creds = firebase_admin.credentials.Certificate("notifications.json")
firebase_admin.initialize_app(creds)

message = messaging.Message(data={'location':'L203','time':str(datetime.datetime.now()),}, token=device_token)
messaging.send(message)