import json
from random import random, randrange
from sys import getsizeof
from locust import HttpUser, task, between

debug = True

def printDebug(msg):
    if debug:
        print(msg)

# Esta clase nos ayudara a manejar todas las acciones de lectura de los datos del archivo
class Reader():

    def __init__(self):
        self.file_path = "./traffic.json"
        # En esta variable almacenaremos nuestros datos
        self.array = []
        # En esta variable almacenaremos los indices que hemos recorrido
        self.read_index = []
        
    def pickRandom(self):

        length = len(self.array)

        if (length > 0):
            random_index = randrange(0, length - 1) if length > 1 else 0
            return self.array.pop(random_index)

        else:
            print (">> Reader: No hay más valores para leer en el archivo.")
            return None
    
    # Cargar el archivo de datos json
    def load(self):
        print (">> Reader: Iniciando con la carga de datos")
        try:
            # Asignamos el valor del archivo traffic.json a la variable data_file
            with open("traffic.json", 'r') as data_file:
                # Con el valor que leemos de data_file vamos a cargar el array con los datos
                self.array = json.loads(data_file.read())
            # Mostramos en consola que hemos finalizado
            
            print (f'>> Reader: Datos cargados correctamente, {len(self.array)} datos -> {getsizeof(self.array)} bytes.')
        except Exception as e:
            # Imprimimos que no pudimos procesar la carga de datos
            print (f'>> Reader: No se cargaron los datos {e}')


class MessageTraffic(HttpUser):
    wait_time = between(0.1, 0.9)

    def on_start(self):
        print (">> MessageTraffic: Iniciando el envio de tráfico")
        self.reader = Reader()
        self.reader.load()

    @task
    def PostMessage(self):
        # Obtener uno de los valores que enviaremos
        random_data = self.reader.pickRandom()
        
        if (random_data is not None):
            data_to_send = json.dumps(random_data)
            printDebug (data_to_send)

            self.client.post("/", json=random_data)

        else:
            print(">> MessageTraffic: Envio de tráfico finalizado, no hay más datos que enviar.")
            self.stop(True) # Se envía True como parámetro para el valor "force", este fuerza a locust a parar el proceso inmediatamente.

    @task
    def GetMessages(self):      
        self.client.get("/")  