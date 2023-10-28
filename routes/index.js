var express = require("express");

const multer = require("multer");

var router = express.Router();

var fs = require("fs");

const lyrics = require("../models/lyrics");

const lyrics_gen = require("../controllers/lyrics");

const mime = require("mime");

const music_create = require("../controllers/create");

let task_pending = [];

let task_complete = [];

const my_space = multer.diskStorage({
    destination: function (req, file, cd) {
        cd(null, "./public/audio");
    },
    filename: function (req, file, cd) {
        cd(
            null,
            `${fs.readdirSync("./public/audio").length}_${file.originalname}`
        );
    },
});

const upload = multer({ storage: my_space });

async function find_entery(song_name) {
    try {
        let entry = await lyrics.find({ file_name: song_name });
        return entry;
    } catch (error) {
        console.log(error);
    }
}

/* GET home page. */
router.get("/", async function (req, res, next) {
    try {
        let ans = await find_entery("Weapons");
        console.log(ans);
        res.render("index");
    } catch (error) {
        console.log(error);
        res.render("index");
    }
});

router.get("/player", function (req, res, next) {
    res.render("player");
});

router.get("/player/:song_name", async function (req, res, next) {
    try {
        let names = req.params.song_name;
        // org_name = names.replace(/^\d+_/g, "");
        // console.log(ans, 63);
        let arr = fs.readdirSync("./public/audio");
        arr = arr.map((e) => {
            return e.replace(/\.\w+$/, "");
        });
        // console.log(arr);
        let founded = arr.findIndex((e, idx) => {
            return e === names;
        });
        console.log(founded);
        if (arr.length === 0) {
            res.render("player", { data: 404 });
        } else if (founded === -1) {
            res.render("player", { data: 403 });
        } else {
            res.render("player", { names, data: arr });
        }
    } catch (error) {
        res.send({ message: error });
    }
});

router.get("/upload", function (req, res, next) {
    res.render("upload");
});

router.get("/link_upload", function (req, res, next) {
    music_url = req.query.audio_link;
    let generator_fileName = null;
    music_create(music_url)
        .then((file_num) => {
            console.log(file_num, "line 95");
            let files = fs.readdirSync(`./public/audio/`);
            matchingFiles = files.find((filename) =>
                filename.startsWith(file_num)
            );
            console.log(matchingFiles);
            generator_fileName = matchingFiles;
            console.log(generator_fileName, 102);
            res.render(`generator`, { song_name: generator_fileName });
        })
        .catch((err) => {
            res.render(`error`, { message: "error", error: err });
        });
});

router.post("/upload", upload.single("music_file"), function (req, res, next) {
    let file_det = req.file;
    console.log(file_det);
    const fileIndex = fs.readdirSync("./public/audio").length - 1;
    const fileName = `${fileIndex}_${file_det.originalname}`;
    res.render(`generator`, { song_name: fileName });
});

router.get("/generator/:name", async function (req, res, next) {
    try {
        let Song_name = req.params.name;
        let real_name = Song_name.replace(/^\d+_|\.\w+$/g, "");
        let ans = await find_entery(Song_name);
        console.log(ans);
        if (ans.length === 0) {
            let done_flag = null,
                pending_flag = null;
            done_flag = task_complete.find((e) => e == Song_name);
            pending_flag = task_pending.find((e) => e == Song_name);
            if (done_flag === undefined && pending_flag === undefined) {
                task_pending.push(Song_name);
                lyrics_gen(Song_name)
                    .then(() => {
                        console.log("done " + Song_name + " check...");
                        let json_name = Song_name.replace(/\.\w+$/, ".json");
                        let curr_lyrics = require(`../json/${json_name}`);
                        // console.log(curr_lyrics);
                        const newlyrics = new lyrics();

                        newlyrics.file_name = real_name;
                        newlyrics.lyrics = curr_lyrics;

                        newlyrics.size = fs.statSync(
                            `./public/audio/${Song_name}`
                        ).size;

                        newlyrics.mimetype = mime.getType(
                            `./public/audio/${Song_name}`
                        );
                        newlyrics
                            .save()
                            .then(() => {
                                console.log("done line 107");
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                        res.json({
                            message: `Lyrics for ${Song_name} generated successfully`,
                            stat: "done",
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json({
                            error: "An error occurred while generating lyrics",
                        });
                    });
            } else {
                res.json({
                    message: `Lyrics generation for ${Song_name} is pending or already done`,
                });
            }
        } else if (ans.length === 1) {
            res.json({
                message: `Lyrics generation for ${Song_name} is already done`,
                stat: "done",
            });
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
});

router.get("/show", function (req, res, next) {
    let arr = fs.readdirSync("./public/audio");
    res.render("show", { data: arr });
});

router.get("/get_lyrics/:org_name", async function (req, res, next) {
    try {
        let org_name = req.params.org_name;
        let ans = await find_entery(org_name);
        // console.log(ans);
        res.json({ ans: ans[0], stat: "done" });
    } catch (error) {
        res.json({ message: error });
    }
});

module.exports = router;
