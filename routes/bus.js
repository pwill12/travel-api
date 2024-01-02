const BusModel = require('../Models/Buses')

const router = require('express').Router();


router.post("/bus", async (req, res) => {
    const Buses = new BusModel(req.body);
    try {
      const saved = await Buses.save();
      res.status(200).json(saved);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //Get a particular location

  router.get("/find/:id", async (req, res) => {
    try {
      const foods = await BusModel.findById(req.params.id);
      res.status(200).json(foods);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //GET ALL FOODITEMS


  router.get("/findbus", async function(req, res) {
    let qNews = req.query.new;
    const depart = req.query.depart;
    const returndate = req.query.return;
    const from = req.query.from;
    const to = req.query.to;

    try {

        if (qNews) {
            const Buses = await BusModel.find().sort({ createdAt: -1 }).limit(1);
            // res.header("Access-Control-Allow-Origin", "*");
            res.status(200).json(Buses);
        } else if (from) {
            BusModel.find({
                    // categories: {
                    //   $in: [qCategory],
                    // },
                    from: from,
                    to: to,
                    depart: depart,
                    return: returndate
                },
                (error, data) => {
                    if (error) {
                        console.log(error);
                    } else if(data.length === 0){
                        res.status(200).json({message: 'No data found'});
                    }else{
                      res.status(200).json(data)
                    }
                }
            );
        } else {
            const findbus = await BusModel.find();
            // res.header("Access-Control-Allow-Origin", "*");
            res.status(200).json(findbus);
        }
    } catch (error) {
        res.status(500).json(error);
    }
});


module.exports = router