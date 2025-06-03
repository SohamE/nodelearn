const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

const deleteOne = (Model) => async (req, res) => {
  try {
    const deletedDoc = await Model.findOneAndDelete({ _id: req.params.id });

    res.status(200).json({
      status: "success",
      data: {
        tour: deletedDoc,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let doc = await Model.findOne({ _id: req.params.id });
    if (!!doc && popOptions) {
      const query = doc.populate(popOptions);
      doc = await query;
    }

    if (!doc) {
      throw new AppError("No document found with the id", 404);
      // return res.status(404).json({
      //   status: "fail",
      //   message: "No document found with the id",
      // });
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

module.exports = {
  deleteOne,
  getOne,
};
