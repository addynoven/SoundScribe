import os
import whisper
from whisper.utils import get_writer
import sys
import warnings
warnings.filterwarnings("ignore")
# Get the path to the audio file
print(os.getcwd())
print(sys.argv)
if (len(sys.argv) == 2):
    audio_file_path = sys.argv[1]
    # Check if Whisper AI has access to the file
    if os.access(audio_file_path, os.R_OK):
        # Whisper AI has access to the file
        print("Generator has access to the file.")
        model = whisper.load_model("medium.en")
        # Transcribe the audio file
        result = model.transcribe(audio_file_path)
        # Print the transcription
        srt_writer = get_writer("srt", "./str/")
        srt_writer(result, audio_file_path)
        json_writer = get_writer("json", "./json/")
        json_writer(result, audio_file_path)
    else:
        # Whisper AI does not have access to the file
        print("Generator does not have access to the file.")
else:
    print("need more argument")
