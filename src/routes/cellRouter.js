const router = require("express").Router();
const CellRezOf2 = require("../models/cellModel");
// const User = require("../models/userModel");
// const auth = require("../middleware/auth");

router.post("/colorCell", async (req, res) => {
    try {
        console.log(req.body);
        // !! check for uniqueness and throw error
        const location = req.body.location
        const color = req.body.color

        console.log(location, color)

        if (!location || !color) {
            return res.status(400).json({ msg: "Not all required fields have been entered." })
        }

        // if cell exists replace it
        const existingLocation = await CellRezOf2.findOneAndDelete({ location: location })
        if (existingLocation) {
            // return res
            //     .status(400)
            //     .json({ msg: "A cell at this location already exists."})
            console.log("existing cell at desired location removed")
        }

        const newCell = new CellRezOf2({
            location: req.body.location,
            cellData:{
                // owner: req.user.username,
                color: req.body.color
            }
        });
        const savedCell = await newCell.save();
        res.json(savedCell);
    } catch(error) {
        res.status(500).json({ err: error.message });
    }
});

router.post("/fetchRegion", async (req, res) => {
    try {
        // desired region = {calc from corner info in request}
        // const requestedCellRegion = {
        //     firstCell: req.body.firstCell,  //ex. [0, 0]
        //     lastCell: req.body.lastCell,  //ex. [841, 841]
        //     // {
        //     // layer2.x + layer1.x * 29, layer2.y + layer1.y * 29
        //     //     absoluteCellPosition: {
        //     //         x: 120
        //     //         y: 120
        //     //     }
        //     //     layer1: {
        //     //         x: 4
        //     //         y: 4
        //     //     }
        //     //     layer2: {
        //     //         x: 4
        //     //         y: 4
        //     //     }
        //     // }
        //     // !! move maximum amount of calculations to frontend
        //     // !! PLS and THANK YOU ^,^ <3
        //     regionWidth:  firstCell.x - lastCell.x, //ex. 25
        //     regionHeight: lastCell.y - firstCell.y //ex. 10
        // }

        // query DB for all cells in desired region
        const cellResponse = await CellRezOf2.find(
            {$and:
                [
                    {"location.0": {$gte: req.body.firstCell.x}},
                    {"location.0": {$lte: req.body.lastCell.x}},
                    {"location.1": {$gte: req.body.firstCell.y}},
                    {"location.1": {$lte: req.body.lastCell.y}}
                ]
            })
            
        res.json(cellResponse);
    } catch(error) {
        res.status(500).json({ err: error.message });
    }
});

module.exports = router;