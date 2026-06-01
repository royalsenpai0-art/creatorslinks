const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const shortid = require("shortid");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.json());

app.use(express.static("public"));

const DB = "links.json";



// LOAD LINKS

function loadLinks() {

    if (!fs.existsSync(DB)) {

        return [];

    }

    return JSON.parse(

        fs.readFileSync(DB)

    );

}



// SAVE LINKS

function saveLinks(data) {

    fs.writeFileSync(

        DB,

        JSON.stringify(data, null, 2)

    );

}



// CREATE LINK

app.post("/api/create", (req, res) => {

    const {

        destination,
        tasks,
        taskLinks

    } = req.body;



    const links = loadLinks();



    const id = shortid.generate();



    const newLink = {

        id,

        destination,

        tasks,

        taskLinks,

        createdAt: Date.now()

    };



    links.unshift(newLink);



    saveLinks(links);



    const shortLink =
        `${req.protocol}://${req.get("host")}/unlock.html?id=${id}`;

    res.json({
        success: true,
        shortLink
    });

});



// GET SINGLE LINK

app.get("/api/link/:id", (req, res) => {

    const links = loadLinks();



    const link = links.find(

        l => l.id === req.params.id

    );



    if (!link) {

        return res.status(404).json({

            error: "Link not found"

        });

    }



    res.json(link);

});



// GET ALL LINKS

app.get("/api/links", (req, res) => {

    res.json(loadLinks());

});



// START SERVER

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

