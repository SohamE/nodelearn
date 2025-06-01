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

module.exports = {
  deleteOne,
};
