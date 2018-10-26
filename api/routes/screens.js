const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Screens = require("../models/screens");
var _ = require('underscore');


// Get all screens present
router.get('/', (req, res, next) => {
    Screens.find()
    .exec()
    .then(docs => {
      console.log(docs);
        if (docs.length >= 0) {
            res.status(200).json(docs);
        } else {
            res.status(404).json({
                message: 'No entries found'
            });
        }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// get unresreved seats
router.get("/:screenname/seats/status/unreserved", (req, res, next) => {
    const id = req.params.screenname;
    Screens.findOne({name: id})
    .exec()
    .then(docs => {
        if (docs) {
            var range = _.range(1, docs.seatInfo.A.numberOfSeats);
            var unreservedA = _.difference(range, docs.seatInfo.A.reserved);

            var range = _.range(1, docs.seatInfo.B.numberOfSeats);
            var unreservedB = _.difference(range, docs.seatInfo.B.reserved);

            var range = _.range(1, docs.seatInfo.C.numberOfSeats);
            var unreservedC = _.difference(range, docs.seatInfo.C.reserved);

            res.status(200).json({"availableSeats" :{"A" : unreservedA, "B": unreservedB, "C": unreservedC}});
        } else {
            res.status(404).json({
                message: 'No entries found'
            });
        }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// TODO: 4, get adjacent seats endpoint
// Keeping in mind the aisle seats, search for seats in segments,
// use the reserved array retreived to process this.


// reserve seats
router.post('/:screenname/reserve', (req, res, next) => {
    const id = req.params.screenname;
    Screens.findOne({name: id})
    .exec()
    .then(doc => {
      if (doc) {
        if((req.body.seats.A === undefined)){
            console.log("empty");
        } else {
            if( (_.intersection(req.body.seats.A, doc.seatInfo.A.reserved)  === [])){
                var newValue = (_.union(req.body.seats.A, doc.seatInfo.A.reserved));
                Screens.updateOne({name: id}, {$set : {"seatInfo.A.reserved" : newValue}})
                .exec()
                .then(result => {
                console.log(result);
                })
                .catch(err => {
                console.log(err);
                });
               console.log("reserving");
               status1 = true;
            } else {
                console.log("Error, already reserved");
                status1 = false;
            }
        }   

        if((req.body.seats.B === undefined)){
            console.log("empty");
        } else {
            if( (_.intersection(req.body.seats.B, doc.seatInfo.B.reserved)  === [])){
                var newValue = (_.union(req.body.seats.B, doc.seatInfo.B.reserved));
                Screens.updateOne({name: id}, {$set : {"seatInfo.B.reserved" : newValue}})
                .exec()
                .then(result => {
                console.log(result);
                })
                .catch(err => {
                console.log(err);
                });
               console.log("reserving");
               status2 = true;
            } else {
                console.log("Error, already reserved");
                status2 = false;
            }
        }

        if((req.body.seats.C === undefined)){
            console.log("empty");
        } else {
            if( (_.intersection(req.body.seats.C, doc.seatInfo.C.reserved)  === [])){
                var newValue = (_.union(req.body.seats.C, doc.seatInfo.C.reserved));
                Screens.updateOne({name: id}, {$set : {"seatInfo.C.reserved" : newValue}})
                .exec()
                .then(result => {
                console.log(result);
                })
                .catch(err => {
                console.log(err);
                });
                console.log("reserving");
                status3 = true;
            } else {
                console.log("Error, already reserved");
                status3 = false;
            }
        }

        if(status1 || status2 || status3){
            res
            .status(200)
            .json({ message: "Requested tickets booked." });
        } else {
            res
            .status(500)
            .json({ message: "Error." });
        }

    } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});


// add new screen
router.post('/', (req, res, next) => {
    const screen = new Screens({
        _id: new mongoose.Types.ObjectId(),
        name : req.body.name,
        seatInfo : {
            A : {
                numberOfSeats : req.body.seatInfo.A.numberOfSeats,
                aisleSeats : req.body.seatInfo.A.aisleSeats,
                reserved : req.body.seatInfo.A.reserved
            },
            B : {
                numberOfSeats : req.body.seatInfo.B.numberOfSeats,
                aisleSeats : req.body.seatInfo.B.aisleSeats,
                reserved : req.body.seatInfo.B.reserved
            },
            C : {
                numberOfSeats : req.body.seatInfo.C.numberOfSeats,
                aisleSeats : req.body.seatInfo.C.aisleSeats,
                reserved : req.body.seatInfo.C.reserved

            }
        }
    });
    screen.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Handling POST requests to /products",
            createdProduct: result
          });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

// router.patch('/', (req, res, next) => {
    // res.status(200).json({
    //     message: 'In router patch'
    // });
// });

router.delete('/:screen-id', (req, res, next) => {
    const id = req.params.screen-id;
    console.log(id);
    Screens.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;