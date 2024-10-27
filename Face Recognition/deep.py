import cv2
import os
import numpy as np
# import RPi.GPIO as GPIO
import time
from threading import Thread
from deepface import DeepFace

# Configuração do GPIO
# GPIO.setmode(GPIO.BCM)
# GPIO.setup(18, GPIO.OUT)  # Use o pino GPIO apropriado

# Variáveis de controle
processing = False
authorized_person = None
display_text = "Aguardando detecção..."

# Inicializar captura de vídeo
video_capture = cv2.VideoCapture(0)

# Função para carregar e pré-processar as imagens autorizadas
def load_authorized_faces(dataset_path, model_name='ArcFace'):
    authorized_embeddings = []
    authorized_names = []
    for person_name in os.listdir(dataset_path):
        person_dir = os.path.join(dataset_path, person_name)
        if not os.path.isdir(person_dir):
            continue
        for image_name in os.listdir(person_dir):
            image_path = os.path.join(person_dir, image_name)
            try:
                # Carregar a imagem
                img = cv2.imread(image_path)
                if img is None:
                    print(f"Não foi possível ler {image_path}")
                    continue

                # Aplicar data augmentation (opcional)
                images = [img] + augment_image(img)

                for augmented_img in images:
                    # Obter embedding e normalizar
                    embedding = DeepFace.represent(
                        img_path=augmented_img,
                        model_name=model_name,
                        enforce_detection=True,
                        anti_spoofing=True,
                        detector_backend='retinaface'
                    )
                    if embedding:
                        embedding_vector = np.array(embedding[0]["embedding"])
                        embedding_vector = embedding_vector / np.linalg.norm(embedding_vector)
                        authorized_embeddings.append(embedding_vector)
                        authorized_names.append(person_name)
            except Exception as e:
                print(f"Erro ao processar {image_path}: {e}")
    return authorized_embeddings, authorized_names

# Função opcional para data augmentation
def augment_image(image):
    augmented_images = []
    # Flip horizontal
    augmented_images.append(cv2.flip(image, 1))
    # Rotação
    rows, cols, _ = image.shape
    for angle in [10, -10]:
        M = cv2.getRotationMatrix2D((cols/2, rows/2), angle, 1)
        rotated_image = cv2.warpAffine(image, M, (cols, rows))
        augmented_images.append(rotated_image)
    # Ajuste de brilho
    bright_image = cv2.convertScaleAbs(image, alpha=1.2, beta=30)
    augmented_images.append(bright_image)
    return augmented_images

# Carregar embeddings das pessoas autorizadas
authorized_embeddings, authorized_names = load_authorized_faces('dataset', model_name='ArcFace')

# Função para calcular a distância coseno
def cosine_distance(a, b):
    return 1 - np.dot(a, b)

# Função para processar a face detectada
def process_face(frame):
    global processing, authorized_person, display_text

    try:
        processing = True

        # Detectar e extrair faces
        faces = DeepFace.extract_faces(
            img_path=frame,
            detector_backend='retinaface',
            enforce_detection=True
        )

        if len(faces) == 0:
            print("Nenhuma face detectada")
            return

        print(f"Número de faces detectadas: {len(faces)}")

        # Processar cada face detectada

        for face in faces:
            face_image_rgb = face["face"]
            if face_image_rgb.size == 0:
                print("Face detectada inválida")
                continue

            # Converter a imagem da face para uint8
            if face_image_rgb.dtype != 'uint8':
                if face_image_rgb.max() <= 1.0:
                    face_image_rgb = (face_image_rgb * 255).astype('uint8')
                else:
                    face_image_rgb = face_image_rgb.astype('uint8')

            # Converter a face para BGR (OpenCV usa BGR)
            face_image_bgr = cv2.cvtColor(face_image_rgb, cv2.COLOR_RGB2BGR)

            # Obter o embedding da face detectada
            embedding = DeepFace.represent(
                img_path=face_image_bgr,
                model_name='ArcFace',
                detector_backend='skip',
                enforce_detection=True,
                anti_spoofing=True
            )
            if embedding:
                embedding_vector = np.array(embedding[0]["embedding"])
                embedding_vector = embedding_vector / np.linalg.norm(embedding_vector)
            else:
                print("Não foi possível obter o embedding da face detectada")
                continue

            # Comparar com os embeddings autorizados
            distances = []
            for auth_embedding in authorized_embeddings:
                distance = cosine_distance(auth_embedding, embedding_vector)
                distances.append(distance)
            distances = np.array(distances)

            # Identificar a menor distância e verificar se está abaixo de um limiar
            min_distance_index = np.argmin(distances)
            min_distance = distances[min_distance_index]
            threshold = 0.5  # Ajuste conforme necessário após testes

            if min_distance < threshold:
                authorized_person = authorized_names[min_distance_index]
                confidence = max(0, min(100, (1 - min_distance) * 100))
                display_text = f"Autorizado: {authorized_person} | Confiança: {confidence:.2f}%"
                print(display_text)

                # Acionar o GPIO para abrir a porta
                # GPIO.output(18, GPIO.HIGH)
                # time.sleep(5)  # Manter a porta aberta por 5 segundos
                # GPIO.output(18, GPIO.LOW)
            else:
                confidence = max(0, min(100, (1 - min_distance) * 100))
                display_text = f"Não autorizado | Confiança: {confidence:.2f}%"
                print(display_text)

    except Exception as e:
        print(f"Erro durante o processamento da face: {e}")
        display_text = "Erro no processamento"
    finally:
        processing = False

# Loop principal
try:
    while True:
        ret, frame = video_capture.read()
        if not ret:
            continue

        if not processing:
            # Iniciar uma thread para processar a face
            thread = Thread(target=process_face, args=(frame.copy(),))
            thread.start()

        # Exibir as informações no vídeo
        font = cv2.FONT_HERSHEY_SIMPLEX
        bottomLeftCornerOfText = (10, 30)
        fontScale = 0.7
        fontColor = (0, 255, 0)  # Verde
        lineType = 2

        # Sobrepor o texto no frame
        cv2.putText(frame, display_text,
                    bottomLeftCornerOfText,
                    font,
                    fontScale,
                    fontColor,
                    lineType)

        # Exibir o frame em uma janela
        cv2.imshow('Video', frame)

        # Pressione 'q' para sairyoutube
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

except KeyboardInterrupt:
    print("Interrupção pelo usuário")

finally:
    # Limpar recursos
    video_capture.release()
    cv2.destroyAllWindows()
    # GPIO.cleanup()
