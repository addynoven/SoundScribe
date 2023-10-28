// window.location.href = "http://localhost:3000/generator";

fetch(`http://localhost:3000/generator/${song_name}`)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then((data) => {
        if ("done" == data.stat) {
            song_name = song_name.replace(/\.\w+$/, "");
            window.location.href = `http://localhost:3000/player/${song_name}`;
        }
    })
    .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
    });
