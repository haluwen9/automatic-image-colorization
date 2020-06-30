import os
import io

from flask import Flask
from flask import render_template
from flask import request
from flask import redirect
from flask import url_for
from flask import send_from_directory, send_file
from werkzeug.utils import secure_filename

import numpy as np
import cv2

from libs.Colorizer import Colorizer, to_gray

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './uploads'

colorizer = Colorizer('./model/colorizer_10_0.6904_lab_varsize_multiworker.hdf5')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype = 'image/x-icon')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/colorizer', methods = ['POST'])
def colorize():
    if 'image' not in request.files:
        return '{"exitcode":1, "msg":"No file received!"}'

    codedImg = np.fromfile(request.files['image'], np.uint8)
    img = cv2.imdecode(codedImg, cv2.IMREAD_COLOR)
    img = cv2.cvtColor(cv2.imdecode(codedImg, cv2.IMREAD_COLOR), cv2.COLOR_BGR2RGB)
    colorizedImg = colorizer.predict(img)

    _, codedImg = cv2.imencode('.jpg', colorizedImg)
    
    return send_file(io.BytesIO(codedImg), mimetype="image/jpg")
