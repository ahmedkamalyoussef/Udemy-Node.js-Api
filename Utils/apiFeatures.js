class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  async getFilteredCount() {
    const countQuery = this.mongooseQuery.clone();
    return await countQuery.countDocuments();
  }

  filter(additionalFilter = {}) {
    let queryObj = { ...this.queryString };
    const excludesFields = ["page", "limit", "sort", "fields", "keywords"];
    excludesFields.forEach((field) => delete queryObj[field]);

    queryObj = { ...queryObj, ...additionalFilter };

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  async paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 2;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    // Get the count of documents after applying filters and search
    const filteredCount = await this.getFilteredCount();

    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.totalPages = Math.ceil(filteredCount / limit);
    if (skip > 0) pagination.prev = page - 1;
    if (endIndex < filteredCount) pagination.next = page + 1;

    this.mongooseQuery = this.mongooseQuery.find({}).skip(skip).limit(limit);
    this.paginationResults = pagination;
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.keywords) {
      let query = {};
      if (modelName === "products") {
        query.$or = [
          { title: { $regex: this.queryString.keywords, $options: "i" } },
          { description: { $regex: this.queryString.keywords, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.queryString.keywords, $options: "i" } };
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }
}

module.exports = ApiFeatures;
