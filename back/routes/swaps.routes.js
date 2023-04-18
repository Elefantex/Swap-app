const express = require("express");
const router = express.Router();


const swapController = require("../controllers/swap.controller")

router.get("/swaps", swapController.swaps)
router.delete("/swaps/:id", swapController.deleteSwap)
router.post("/swaps", swapController.createSwap)
router.get("/swaps/:date", swapController.allSwaps)
router.get("/swaps/:id",swapController.swapsId)

module.exports = router