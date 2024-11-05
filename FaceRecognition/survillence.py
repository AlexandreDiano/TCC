import os
import cv2
import numpy as np
import pickle
from threading import Thread, Lock
from deepface import DeepFace
import requests
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from datetime import datetime

os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

processing = False
authorized_person = None
display_text = "Aguardando detecção..."
processing_lock = Lock()
embeddings_lock = Lock()
threshold = 0.57

video_capture = cv2.VideoCapture(0)

embeddings_file = './dataset/authorized_embeddings.pkl'

def load_authorized_faces(dataset_path, model_name='ArcFace'):
    authorized_embeddings = []
    authorized_names = []
    print("Carregando dataset autorizado...")
    for person_name in os.listdir(dataset_path):
        person_dir = os.path.join(dataset_path, person_name)
        if not os.path.isdir(person_dir):
            continue
        for image_name in os.listdir(person_dir):
            image_path = os.path.join(person_dir, image_name)
            try:
                embedding = DeepFace.represent(
                    img_path=image_path,
                    model_name=model_name,
                    enforce_detection=False,
                    detector_backend='retinaface'
                )
                if embedding:
                    embedding_vector = np.array(embedding[0]["embedding"])
                    embedding_vector = embedding_vector / np.linalg.norm(embedding_vector)
                    authorized_embeddings.append(embedding_vector)
                    authorized_names.append(person_name)
                    print(f"Embedding carregado para {person_name} (norma: {np.linalg.norm(embedding_vector):.4f})")
                else:
                    print(f"Não foi possível gerar embedding para {image_path}")
            except Exception as e:
                print(f"Erro ao processar {image_path}: {e}")
    print(f"Total de embeddings carregados: {len(authorized_embeddings)}")
    return authorized_embeddings, authorized_names

def save_embeddings(embeddings, names, filename):
    with open(filename, 'wb') as f:
        pickle.dump({'embeddings': embeddings, 'names': names}, f)
    print(f"Embeddings salvos em {filename}")

def load_embeddings(filename):
    with open(filename, 'rb') as f:
        data = pickle.load(f)
    print(f"Embeddings carregados de {filename}")
    return data['embeddings'], data['names']

def update_embeddings():
    global authorized_embeddings, authorized_names
    with embeddings_lock:
        authorized_embeddings, authorized_names = load_authorized_faces('./dataset', model_name='ArcFace')
        save_embeddings(authorized_embeddings, authorized_names, embeddings_file)
    print("Embeddings atualizados.")

class DatasetEventHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        if event.is_directory:
            return
        if event.event_type in ('created', 'deleted', 'modified', 'moved'):
            print(f"Detectada alteração no dataset: {event.src_path}")
            update_embeddings()

def start_observer():
    event_handler = DatasetEventHandler()
    observer = Observer()
    observer.schedule(event_handler, path='./dataset', recursive=True)
    observer.start()
    return observer

if os.path.exists(embeddings_file):
    authorized_embeddings, authorized_names = load_embeddings(embeddings_file)
else:
    authorized_embeddings, authorized_names = load_authorized_faces('./dataset', model_name='ArcFace')
    save_embeddings(authorized_embeddings, authorized_names, embeddings_file)

observer = start_observer()

def cosine_distance(a, b):
    return 1 - np.dot(a, b)

def process_face(frame):
    global processing, authorized_person, display_text

    with processing_lock:
        processing = True

    try:
        faces = DeepFace.extract_faces(
            img_path=frame,
            detector_backend='retinaface',
            enforce_detection=False
        )

        if not faces:
            print("Nenhuma face detectada")
            display_text = "Nenhuma face detectada"
            return

        print(f"Número de faces detectadas: {len(faces)}")

        for face in faces:
            face_image_rgb = face["face"]
            if face_image_rgb.size == 0:
                print("Face detectada inválida")
                continue

            if face_image_rgb.dtype != 'uint8':
                if face_image_rgb.max() <= 1.0:
                    face_image_rgb = (face_image_rgb * 255).astype('uint8')
                else:
                    face_image_rgb = face_image_rgb.astype('uint8')

            face_image_bgr = cv2.cvtColor(face_image_rgb, cv2.COLOR_RGB2BGR)

            embedding = DeepFace.represent(
                img_path=face_image_bgr,
                model_name='ArcFace',
                detector_backend='retinaface',
                enforce_detection=False
            )
            if embedding:
                embedding_vector = np.array(embedding[0]["embedding"])
                embedding_vector = embedding_vector / np.linalg.norm(embedding_vector)
                print(f"Embedding da face detectada (norma: {np.linalg.norm(embedding_vector):.4f})")
            else:
                print("Não foi possível obter o embedding da face detectada")
                continue

            with embeddings_lock:
                current_embeddings = authorized_embeddings.copy()
                current_names = authorized_names.copy()

            distances = []
            for idx, auth_embedding in enumerate(current_embeddings):
                distance = cosine_distance(auth_embedding, embedding_vector)
                distances.append(distance)

            distances = np.array(distances)

            if distances.size > 0:
                min_distance_index = np.argmin(distances)
                min_distance = distances[min_distance_index]

                if min_distance < threshold:
                    authorized_person = current_names[min_distance_index]
                    confidence = max(0, min(100, (1 - (min_distance / threshold)) * 100))
                    display_text = f"Autorizado: {authorized_person} | Confiança: {confidence:.2f}%"
                    print(display_text)

                    save_detected_face(face_image_bgr, authorized_person)

                    try:
                        response = requests.post("http://localhost:5555/open")
                        if response.status_code == 200:
                            print("Requisição enviada com sucesso.")
                        else:
                            print(f"Falha na requisição. Status: {response.status_code}")
                    except requests.exceptions.RequestException as e:
                        print(f"Erro ao enviar requisição: {e}")
                else:
                    confidence = max(0, min(100, (1 - (min_distance / threshold)) * 100))
                    display_text = f"Não autorizado | Confiança: {confidence:.2f}%"
                    print(display_text)

            else:
                print("Nenhuma face correspondente encontrada.")
                display_text = "Nenhuma face correspondente encontrada."

    except Exception as e:
        print(f"Erro durante o processamento da face: {e}")
        display_text = "Erro no processamento"
    finally:
        with processing_lock:
            processing = False

def save_detected_face(face_image_bgr, person_name):
    save_dir = './entries'
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)

    now = datetime.now()
    timestamp = now.strftime("%Y%m%d_%H%M%S")

    filename = f"{person_name}_{timestamp}.jpg"
    filepath = os.path.join(save_dir, filename)

    cv2.imwrite(filepath, face_image_bgr)
    print(f"Imagem salva: {filepath}")

try:
    while True:
        ret, frame = video_capture.read()
        if not ret:
            continue

        frame = cv2.flip(frame, 1)
        frame_resized = cv2.resize(frame, (640, 480))

        with processing_lock:
            if not processing:
                thread = Thread(target=process_face, args=(frame_resized,))
                thread.start()

        cv2.putText(frame_resized, display_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

        cv2.imshow('Video', frame_resized)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

except KeyboardInterrupt:
    print("Interrompido pelo usuário")
finally:
    observer.stop()
    observer.join()
    video_capture.release()
    cv2.destroyAllWindows()
