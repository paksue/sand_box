# Hold custom gesture training

This folder contains the experimental build-time training path for Hold's custom hand gestures.

## 1. Capture a dataset

Open `../train-gestures.html` from the deployed site on the phone you actually use for Hold.

Capture three classes:

- `start` — thumbs-up command.
- `pause` — open-palm command.
- `none` — required negative class covering all non-command hand poses/movements.

The capture page exports:

```text
hold-gesture-dataset/
  start/*.jpg
  pause/*.jpg
  none/*.jpg
  manifest.json
  README.txt
```

MediaPipe Model Maker currently requires the `<dataset_path>/<label>/<image>` layout and requires one label named `none`.

## 2. Train in Google Colab

Open `hold_gesture_model_maker.ipynb` in Colab and run the cells in order.

The notebook:

1. installs `mediapipe-model-maker`;
2. uploads and unpacks the dataset ZIP;
3. loads hand landmarks with `gesture_recognizer.Dataset.from_folder()`;
4. splits 80% training / 10% validation / 10% test;
5. trains with Model Maker defaults;
6. evaluates test loss/accuracy;
7. exports and downloads `gesture_recognizer.task`.

MediaPipe Model Maker is deprecated and no longer actively maintained, so this is an experiment/benchmark pipeline rather than a permanent dependency of the Hold runtime.

## 3. Do not replace production yet

Save the first output as `hold-gestures-v1.task` and A/B test it against the current canned model. Measure intentional START/PAUSE recognition and false activations before changing the production adapter.
