const Order = require("../models/Order");

const router = require("express").Router();

//CREATE ORDER

router.post("/payme", async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json({message: 'order successfully placed',
    ORDERID: savedOrder._id
  });
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ORDER DETAILS

router.get("/findorder/:id", async function (req, res) {
  try {
      const getorder = await Order.findOne({_id: req.params.id});
      res.status(200).json(getorder);
    } catch (err) {
      res.status(500).json(err);
    }
});



module.exports = router;