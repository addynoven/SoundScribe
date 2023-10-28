const { spawn } = require("child_process");
const { readdirSync, rename, renameSync } = require("fs");

function music_create(songName) {
    return new Promise((resolve, reject) => {
        curr_num = readdirSync("./public/audio").length;
        const videoUrl = songName;
        const outputPath = `./public/audio/`; // Set your desired output path here

        const options = [
            "-x", // Specify the -x option
            "--audio-format",
            "mp3", // Set the desired audio format
            "--audio-quality",
            "0", // Set the audio quality (0 is the highest)
            "-o",
            `${outputPath}/${curr_num}_%(title)s.%(ext)s`, // Set the output template
            videoUrl, // URL of the video
        ];

        const youtubeDlProcess = spawn("youtube-dl", options);

        youtubeDlProcess.on("close", (code) => {
            if (code === 0) {
                console.log("Download completed successfully.");
                let files = readdirSync(`./public/audio/`);
                matchingFiles = files.find((filename) =>
                    filename.startsWith(curr_num)
                );
                Extension = matchingFiles.split(".").pop();
                let oldFilePath = `./public/audio/${matchingFiles}`;
                let newFilePath = `./public/audio/${matchingFiles
                    .replace(/[^a-zA-Z0-9]/g, "_")
                    .replace(/_+/g, "_")
                    .replace(/^_+|_+$/g, "")}`;
                basename = newFilePath.split("_");
                basename.pop();
                newFilePath = basename.join("_");
                newFilePath = newFilePath + "." + Extension;
                console.log(newFilePath, "\n", oldFilePath, 40, "create.js");
                renameSync(oldFilePath, newFilePath);
                resolve(curr_num);
            } else {
                console.error("Download failed.");
                reject(new Error("Download failed."));
            }
        });
    });
}

module.exports = music_create;
