const Cart = require("../Models/Cart");

const router = require("express").Router();

//CREATE CART

router.post("/cart", async(req, res) => {
  try {
      Cart.findOne({ 'userid': req.body.userid }).exec((err, foods) => {
          if (err) return res.status(400).json({ err });
          if (foods) {
              const mycart = req.body.fooditems.foodid;
              //user and foodid are different
              //food id needs to be passed to check if the item is already
              //in the cart
              //userid checks if the user has already added it to cart
              const alreadyincart = foods.jobitems.find((c) => c.foods == mycart);
              if (alreadyincart) {
                  res.status(401).json("item already added to cart");
              } else {
                  Apply.findOneAndUpdate({ userid: req.body.userid }, {
                      $push: {
                          fooditems: req.body.fooditems,
                      },
                  }).exec((err, foods) => {
                      if (err) console.log(err);
                      if (foods) {
                          return res.status(201).json({ items: foods });
                      }
                  });
              }
          } else {
              const newFoods = new Cart(
                  req.body
              );
              newFoods.save()
              res.status(201).json({message: 'Items added to cart successfully'})
          }
      });
  } catch (error) {
      console.log(error);
  }
});

// router.post("/", verifyToken, async (req, res) => {
//   const newCart = new Cart(req.body);

//   try {
//     const savedCart = await newCart.save();
//     res.status(200).json(savedCart);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });


module.exports = router;