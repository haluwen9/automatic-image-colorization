import numpy as np
import tensorflow as tf
import cv2

class Colorizer:
    """A wrapper for colorizer trained in keras model
    which pretend to predict images one by one (batch_size = 1)
    without fixed size (target_size = None)
    """

    def __init__(self, model_path, mode='lab'):
        self._model_path = model_path
        print(model_path)
        self._model = tf.keras.models.load_model(self._model_path)
        if mode not in ('lab', 'rgb'):
            raise ValueError("mode must be 'lab' or 'rgb'.")
        self._mode = mode.lower()
    
    def predict(self, img):
        if type(img) != np.float32:
            img = (img*1/255).astype(np.float32)
        
        img = to_gray(img)

        if len(img.shape) < 4:
            img = np.array([img])
        pred = self._model.predict(img, batch_size=1, verbose=0, workers=1)
        # pred = self._model.predict(img, batch_size=1, verbose=0, workers=1)
        pred = np.array([cv2.resize(pred[0], (img.shape[2], img.shape[1]))])
        if self._mode == 'lab':
            print(pred.shape, img.shape)
            pred = cv2.cvtColor((np.concatenate([img[0], pred[0]], axis=-1)*255).astype(np.uint8), cv2.COLOR_LAB2BGR).astype(np.uint8)
        return pred

def to_gray(x):
    return np.expand_dims(np.average(x, axis=-1, weights=[0.3, 0.59, 0.11]), axis=-1)