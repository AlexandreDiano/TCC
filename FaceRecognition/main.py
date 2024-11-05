import os
import shutil
import cv2
import time
from flask import Flask, request, jsonify
from ultralytics import YOLO
from deepface import DeepFace
import firebase_admin
from firebase_admin import credentials, storage
from flask_cors import CORS

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
  'storageBucket': 'smartdoor-ed317.appspot.com'
})

model = YOLO('yolov8n-face.pt')

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
  return "Hello World!"

@app.route('/open', methods=['POST', 'GET'])
def open_door():
  return "abrido!"

@app.route('/detect_face', methods=['POST'])
def detect_face():
  uploaded_image = request.files.get('image')
  username = request.form.get('username')

  try:
    if uploaded_image and username:
      user_directory = f"./dataset/{username}"
      if not os.path.exists(user_directory):
        os.makedirs(user_directory)

      image_path = os.path.join(user_directory, uploaded_image.filename)
      uploaded_image.save(image_path)

      result = process_image(image_path, username)

      print(result)

      if(result == 200):
        print('result 200')
        return jsonify("success": "Imagem cadastrada com sucesso"), 200
      else:
        print('result 400')
        return jsonify(result), 400
    else:
      return jsonify({"error": "No image or username provided"}), 400

  except Exception as e:
    print(f"Error comparing images: {e}")
    return jsonify({"verified": False, "error": str(e)}), 500
  finally:
    shutil.rmtree("./dataset", ignore_errors=True)

@app.route('/delete_image', methods=['POST'])
def delete_image():
    username = request.form.get('username')
    image_name = request.form.get('image_name')

    print(f"Username recebido: {username}")
    print(f"Nome da imagem recebida: {image_name}")

    if not username or not image_name:
        print("Requisição recebida não contém os parâmetros esperados.")
        print(f"Dados recebidos: {request.form}")
        return jsonify({"error": "No username or image name provided"}), 400

    try:
        bucket = storage.bucket()
        blob_path = f"{username}/{image_name}"
        blob = bucket.blob(blob_path)

        if blob.exists():
            blob.delete()
            print(f"Imagem {image_name} deletada com sucesso do usuário {username}.")
            return jsonify({"message": f"Image {image_name} deleted successfully."}), 200
        else:
            print(f"Imagem {image_name} não encontrada para o usuário {username}.")
            return jsonify({"error": "Image not found"}), 404

    except Exception as e:
        print(f"Error deleting image: {e}")
        return jsonify({"error": str(e)}), 500


def process_image(image_path, username):
  model.classes = [0]

  image = cv2.imread(image_path)
  if image is None:
    raise FileNotFoundError(f"Não foi possível encontrar ou abrir a imagem: {image_path}")

  results = model.predict(image, conf=0.5)

  total_faces = sum(len(result.boxes) for result in results)

  if total_faces > 0:
    print(f"{total_faces} face(s) detectada(s) na imagem.")
    upload = upload_to_firebase(image_path, username)
    return 200
  else:
    return 400

def upload_to_firebase(file_path, username):
  bucket = storage.bucket()
  blob = bucket.blob(f"{username}/{os.path.basename(file_path)}")
  blob.upload_from_filename(file_path)
  return f"File {file_path} uploaded to Firebase."

@app.route('/verify_access', methods=['POST'])
def verify_access():
  uploaded_image = request.files.get('image')
  username = request.form.get('username')

  try:
    if uploaded_image and username:
      image_path = os.path.join('./uploaded_images', uploaded_image.filename)
      if not os.path.exists('./uploaded_images'):
        os.makedirs('./uploaded_images')
      uploaded_image.save(image_path)

      comparison_result = compare_with_processed_images(image_path, username)

      return jsonify(comparison_result), 200
    else:
      return jsonify({"error": "No image or username provided"}), 400

  except Exception as e:
    print(f"Error comparing images: {e}")
    return jsonify({"verified": False, "error": str(e)}), 500

def compare_with_processed_images(image_path, username):
  bucket = storage.bucket()
  blobs = bucket.list_blobs(prefix=f"{username}/")

  temp_user_directory = f"./temp_dir/{username}/"

  if not os.path.exists(temp_user_directory):
    os.makedirs(temp_user_directory)

  for blob in blobs:
    temp_image_path = os.path.join(temp_user_directory, blob.name.split('/')[-1])
    blob.download_to_filename(temp_image_path)

  try:
    first_image = os.listdir(temp_user_directory)[0]
    results = DeepFace.verify(
      img1_path=image_path,
      img2_path=os.path.join(temp_user_directory, first_image),
      detector_backend="dlib",
      model_name="Dlib"
    )

    if results['verified']:
      return {"verified": True, "distance": results['distance']}
    else:
      return {"verified": False, "distance": results['distance']}

  except Exception as e:
    print(f"Error comparing images: {e}")
    return {"verified": False, "error": str(e)}

  finally:
    shutil.rmtree('./uploaded_images', ignore_errors=True)
    shutil.rmtree('./temp_dir', ignore_errors=True)

def sync_images_from_storage():
  bucket = storage.bucket()
  blobs = bucket.list_blobs()

  local_dataset_dir = "./dataset"
  if not os.path.exists(local_dataset_dir):
    os.makedirs(local_dataset_dir)

  for blob in blobs:
    if blob.content_type and blob.content_type.startswith("image/"):
      local_file_path = os.path.join(local_dataset_dir, os.path.basename(blob.name))
      if not os.path.exists(local_file_path):
        print(f"Baixando imagem: {blob.name}")
        blob.download_to_filename(local_file_path)
      else:
        print(f"Imagem {blob.name} já existe. Ignorando download.")

def start_sync_process(interval=60):
  while True:
    print("Sincronizando imagens do Firebase Storage...")
    try:
      sync_images_from_storage()
    except Exception as e:
      print(f"Erro ao sincronizar imagens: {e}")
    time.sleep(interval)

if __name__ == '__main__':
  import threading
  sync_thread = threading.Thread(target=start_sync_process, daemon=True)
  sync_thread.start()

  app.run(host='0.0.0.0', port=5555, debug=True)
