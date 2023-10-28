const { spawn } = require("child_process");

function lyrics_gen(songName) {
    console.log(songName, 4);
    return new Promise((resolve, reject) => {
        const pythonScript = "./controllers/Generator.py";
        const pythonArgs = [`./public/audio/${songName}`];

        const pythonProcess = spawn("python", [
            "-W ignore",
            pythonScript,
            ...pythonArgs,
        ]);

        let pythonOutput = "";

        // Handle Python script output
        pythonProcess.stdout.on("data", (data) => {
            pythonOutput = data.toString();
            console.log(`Python Output: ${pythonOutput}`);
        });

        // Handle errors or script completion
        pythonProcess.on("close", (code) => {
            if (code === 0) {
                console.log("Python script execution complete.");
                resolve(pythonOutput);
            } else {
                const errorMessage = `Python script execution failed with code ${code}`;
                reject(new Error(errorMessage));
            }
        });
    });
}

module.exports = lyrics_gen;
