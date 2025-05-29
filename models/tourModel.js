const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    groupSize: {
      type: Number,
      required: [true, "A tour must have a groupSize"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
    },
    rating: {
      type: Number,
      default: 3.5,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    slug: String,
    description: {
      type: String,
    },
    startDate: {
      type: [String],
      required: [true, "A tour must have a start date"],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start}ms`);
  next();
});

tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  next();
});

const Tour = mongoose.model("Tour", tourSchema, "tours");

module.exports = Tour;
