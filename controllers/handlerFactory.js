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

const getOne = (Model, popOptions) => async (req, res) => {
  try {
    let query = await Model.findOne({ _id: req.params.id });
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return res.status(404).json({
        status: "fail",
        message: "No document found with the id",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

module.exports = {
  deleteOne,
  getOne,
};
