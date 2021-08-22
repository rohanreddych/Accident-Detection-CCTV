import datetime
from collections import OrderedDict

import cv2
import cv2 as cv
import firebase_admin
import numpy as np
from firebase_admin import messaging
# import the necessary packages
from scipy.spatial import distance as dist


class CentroidTracker():
    def __init__(self, maxDisappeared=50):
        # initialize the next unique object ID along with two ordered
        # dictionaries used to keep track of mapping a given object
        # ID to its centroid and number of consecutive frames it has
        # been marked as "disappeared", respectively
        self.nextObjectID = 0
        self.objects = OrderedDict()
        self.disappeared = OrderedDict()

        # store the number of maximum consecutive frames a given
        # object is allowed to be marked as "disappeared" until we
        # need to deregister the object from tracking
        self.maxDisappeared = maxDisappeared
        
    def register(self, centroid):
        # when registering an object we use the next available object
        # ID to store the centroid
        self.objects[self.nextObjectID] = centroid
        self.disappeared[self.nextObjectID] = 0
        self.nextObjectID += 1
        
    def deregister(self, objectID):
        # to deregister an object ID we delete the object ID from
        # both of our respective dictionaries
        del self.objects[objectID]
        del self.disappeared[objectID]
        
    def update(self, rects):
        # check to see if the list of input bounding box rectangles
        # is empty
        if len(rects) == 0:
            # loop over any existing tracked objects and mark them
            # as disappeared
            for objectID in list(self.disappeared.keys()):
                self.disappeared[objectID] += 1

                # if we have reached a maximum number of consecutive
                # frames where a given object has been marked as
                # missing, deregister it
                if self.disappeared[objectID] > self.maxDisappeared:
                    self.deregister(objectID)
 
            # return early as there are no centroids or tracking info
            # to update
            return self.objects
        
        # initialize an array of input centroids for the current frame
        inputCentroids = np.zeros((len(rects), 2), dtype="int")

        # loop over the bounding box rectangles
        for (i, (startX, startY, endX, endY)) in enumerate(rects):
            # use the bounding box coordinates to derive the centroid
            cX = int((startX + endX) / 2.0)
            cY = int((startY + endY) / 2.0)
            inputCentroids[i] = (cX, cY)
            
        # if we are currently not tracking any objects take the input
        # centroids and register each of them
        if len(self.objects) == 0:
            for i in range(0, len(inputCentroids)):
                self.register(inputCentroids[i])
                
        # otherwise, are are currently tracking objects so we need to
        # try to match the input centroids to existing object
        # centroids
        else:
            # grab the set of object IDs and corresponding centroids
            objectIDs = list(self.objects.keys())
            objectCentroids = list(self.objects.values())

            # compute the distance between each pair of object
            # centroids and input centroids, respectively -- our
            # goal will be to match an input centroid to an existing
            # object centroid
            D = dist.cdist(np.array(objectCentroids), inputCentroids)

            # in order to perform this matching we must (1) find the
            # smallest value in each row and then (2) sort the row
            # indexes based on their minimum values so that the row
            # with the smallest value is at the *front* of the index
            # list
            rows = D.min(axis=1).argsort()

            # next, we perform a similar process on the columns by
            # finding the smallest value in each column and then
            # sorting using the previously computed row index list
            cols = D.argmin(axis=1)[rows]
            
            # in order to determine if we need to update, register,
            # or deregister an object we need to keep track of which
            # of the rows and column indexes we have already examined
            usedRows = set()
            usedCols = set()

            # loop over the combination of the (row, column) index
            # tuples
            for (row, col) in zip(rows, cols):
                # if we have already examined either the row or
                # column value before, ignore it
                # val
                if row in usedRows or col in usedCols:
                    continue
 
                # otherwise, grab the object ID for the current row,
                # set its new centroid, and reset the disappeared
                # counter
                objectID = objectIDs[row]
                self.objects[objectID] = inputCentroids[col]
                self.disappeared[objectID] = 0
 
                # indicate that we have examined each of the row and
                # column indexes, respectively
                usedRows.add(row)
                usedCols.add(col)
                
            # compute both the row and column index we have NOT yet
            # examined
            unusedRows = set(range(0, D.shape[0])).difference(usedRows)
            unusedCols = set(range(0, D.shape[1])).difference(usedCols)
            
            # in the event that the number of object centroids is
            # equal or greater than the number of input centroids
            # we need to check and see if some of these objects have
            # potentially disappeared
            if D.shape[0] >= D.shape[1]:
                # loop over the unused row indexes
                for row in unusedRows:
                    # grab the object ID for the corresponding row
                    # index and increment the disappeared counter
                    objectID = objectIDs[row]
                    self.disappeared[objectID] += 1
 
                    # check to see if the number of consecutive
                    # frames the object has been marked "disappeared"
                    # for warrants deregistering the object
                    if self.disappeared[objectID] > self.maxDisappeared:
                        self.deregister(objectID)
                        
            # otherwise, if the number of input centroids is greater
            # than the number of existing object centroids we need to
            # register each new input centroid as a trackable object
            else:
                for col in unusedCols:
                    self.register(inputCentroids[col])
 
        # return the set of trackable objects
        return self.objects

ct = CentroidTracker()


cap = cv2.VideoCapture("MJ Market (online-video-cutter.com).mp4")
arr = np.load("test.npy", allow_pickle=True)
h = 0

ret, prev = cap.read()
prvs = cv.cvtColor(prev,cv.COLOR_BGR2GRAY)

sd = np.zeros([500, 100])


try:
    while(cap.isOpened()):
        ret, frame = cap.read()
        hsv = np.zeros_like(frame)
        hsv[...,1] = 255
        ne = []
        if ret == True:
            next_f = cv.cvtColor(frame,cv.COLOR_BGR2GRAY)
            for i in arr[h]:
                # print(i)
                frame  = cv2.rectangle(frame, ( int(frame.shape[1]*i[1]) , int(frame.shape[0] * abs(i[0])) ) , (int(frame.shape[1]*i[3]) , int(frame.shape[0] *abs(i[2])) ) ,(255, 0, 0), 2)
                ne.append([int(frame.shape[1]*i[1]) , int(frame.shape[0] * abs(i[0])), int(frame.shape[1]*i[3]) , int(frame.shape[0] *abs(i[2]))])
            
            flow = cv.calcOpticalFlowFarneback(prvs,next_f, None, 0.5, 3, 15, 3, 5, 1.2, 0)
            mag, ang = cv.cartToPolar(flow[...,0], flow[...,1])
            hsv[...,0] = ang*180/np.pi/2
            hsv[...,2] = cv.normalize(mag,None,0,255,cv.NORM_MINMAX)
            bgr = cv.cvtColor(hsv,cv.COLOR_HSV2BGR)
            bgr  = cv2.rectangle(bgr, ( int(frame.shape[1]*i[1]) , int(frame.shape[0] * abs(i[0])) ) , (int(frame.shape[1]*i[3]) , int(frame.shape[0] *abs(i[2])) ) ,(255, 255, 255), 4)

            objects = ct.update(ne)
            for (objectID, centroid) in objects.items():
                text = "ID {}".format(objectID)
                cv2.putText(frame, text, (centroid[0] - 10, centroid[1] - 10),cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                cv2.circle(frame, (centroid[0], centroid[1]), 4, (0, 255, 0), -1)
            
            g = 0



            cv2.imshow('Frame', frame)
            cv2.imshow("flow", bgr)
            h+=1
            prvs = next_f
            if cv2.waitKey(25) & 0xFF == ord('q'):
                break
        else:
            break
    cap.release()
    device_token = "xyz:PA91bE_LzRpkl4VmrqpuGcPcqv1IFPxzbSL8rue0dO6pfGCn7UpYq1zBFA3Ym-gAuBzB9hfJtu8t0-LpGL0QCFvqmc7bzVmHLRpTg6SDzXPrkWOU9oUjc7AUozqHaR4XmtSgcrlBcSM"

    creds = firebase_admin.credentials.Certificate("notifications.json")
    firebase_admin.initialize_app(creds)

    message = messaging.Message(data={'location':'L203','time':str(datetime.datetime.now()),}, token=device_token)
    messaging.send(message)
except Exception:
    print(256)