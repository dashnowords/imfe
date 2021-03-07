import cv2

webcam = 0
video_capture = cv2.VideoCapture(webcam)

while True:
    # Grab a single frame of video
    ret, frame = video_capture.read()
    frame = cv2.resize(frame, (0, 0), fx=0.75, fy=0.75)
    # Display the resulting image
    cv2.namedWindow('Thermo')
    cv2.resizeWindow("Thermo", 480, 320)
    cv2.imshow('Thermo', frame)

    # Hit 'q' on the keyboard to quit!
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release handle to the webcam
video_capture.release()
cv2.destroyAllWindows()
