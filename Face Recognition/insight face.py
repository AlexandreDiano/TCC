import cv2
import os
import numpy as np
# import RPi.GPIO as GPIO
import time
from threading import Thread
from deep import DeepFace

# Configuração do GPIO
# GPIO.setmode(GPIO.BCM)
# GPIO.setup(18, GPIO.OUT)

# Variáveis de controle
processing = False
authorized_person = None

# Inicializar captura de vídeo
video_capture = cv2.VideoCapture(0)

# Carregar embeddings das pessoas autorizadas
def load_authorized_faces(dataset_path, model_name='Facenet'):
    authorized_embeddings = []
    authorized_names = []
    for person_name in os.listdir(dataset_path):
        person_dir = os.path.join(dataset_path, person_name)
        if not os.path.isdir(person_dir):
            continue
        for image_name in os.listdir(person_dir):
            image_path = os.path.join(person_dir, image_name)
            try:
                embedding = DeepFace.represent(img_path=image_path, model_name=model_name, enforce_detection=False)
                authorized_embeddings.append(embedding[0]["embedding"])
                authorized_names.append(person_name)
            except Exception as e:
                print(f"Erro ao processar {image_path}: {e}")
    return authorized_embeddings, authorized_names

# Carregar embeddings das pessoas autorizadas
authorized_embeddings, authorized_names = load_authorized_faces('dataset', model_name='Facenet')  # Você pode escolher outro modelo

# Função para processar a face detectada
def process_face(frame):
    global processing, authorized_person
    processing = True

    try:
        # Detectar e alinhar a face
        detections = DeepFace.detectFace(img_path=frame, detector_backend='opencv', enforce_detection=False)
        if detections is None:
            print("Nenhuma face detectada")
            processing = False
            return

        # Obter embedding da face detectada
        embedding = DeepFace.represent(img_path=frame, model_name='Facenet', enforce_detection=False)
        if embedding is None:
            print("Não foi possível obter o embedding")
            processing = False
            return

        embedding = embedding[0]["embedding"]

        # Comparar com os embeddings autorizados
        distances = []
        for auth_embedding in authorized_embeddings:
            distance = np.linalg.norm(auth_embedding - embedding)
            distances.append(distance)
        distances = np.array(distances)

        # Identificar a menor distância e verificar se está abaixo de um limiar
        min_distance_index = np.argmin(distances)
        min_distance = distances[min_distance_index]
        threshold = 10  # Ajuste conforme necessário

        if min_distance < threshold:
            authorized_person = authorized_names[min_distance_index]
            print(f"Pessoa autorizada detectada: {authorized_person}")

            # Acionar o GPIO para abrir a porta
            # GPIO.output(18, GPIO.HIGH)
            # time.sleep(5)  # Manter a porta aberta por 5 segundos
            # GPIO.output(18, GPIO.LOW)
        else:
            print("Pessoa não autorizada")

    except Exception as e:
        print(f"Erro durante o processamento da face: {e}")

    processing = False

# Loop principal
try:
    while True:
        ret, frame = video_capture.read()
        if not ret:
            continue

        if not processing:
            # Iniciar uma thread para processar a face
            thread = Thread(target=process_face, args=(frame,))
            thread.start()

        # Opcional: mostrar o vídeo em uma janela
        # cv2.imshow('Video', frame)
        # if cv2.waitKey(1) & 0xFF == ord('q'):
        #     break

except KeyboardInterrupt:
    print("Interrupção pelo usuário")

finally:
    # Limpar recursos
    video_capture.release()
    cv2.destroyAllWindows()
    # GPIO.cleanup()
