// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;
  private defaultSort: Record<string, number>;

  private hasFilterConditions: boolean;
  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.query = query;
    this.modelQuery = modelQuery;
    this.defaultSort = { createdAt: -1 }; // Default sort
    this.hasFilterConditions = false;
  }

  // * Adds a search condition based on the searchable fields
  search(searchableFields: string[]) {
    const searchTerm = this.query?.searchTerm as string;

    if (searchTerm) {
      this.hasFilterConditions = true;
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: "i" },
            } as FilterQuery<T>)
        ),
      });
    }

    return this;
  }

  // * Filters the query by excluding specified fields
  filter() {
    const queryObj = { ...this.query };
    const excludeFields = [
      "searchTerm",
      "page",
      "limit",
      "sort",
      "fields",
      "authorId.name",
    ];

    excludeFields.forEach((field) => delete queryObj[field]);

    if (Object.keys(queryObj).length > 0) {
      this.hasFilterConditions = true;
      this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    }

    return this;
  }

  // * Sorts the query based on defaultSort and conditional sorting if filters are applied

  sort() {
    const sortCriteria = this.hasFilterConditions
      ? { upVoteNumber: -1, ...this.defaultSort }
      : this.defaultSort;

    this.modelQuery = this.modelQuery.sort(sortCriteria);

    return this;
  }

  // * Pagination setup
  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  // * Field selection
  fields() {
    if (this.query.fields) {
      const fields = (this.query.fields as string).split(",").join(" ");
      this.modelQuery = this.modelQuery.select(fields);
    } else {
      this.modelQuery = this.modelQuery.select("-__v"); // Exclude version by default
    }

    return this;
  }

  // * Finalizes the query with sort and returns the modelQuery
  build() {
    return this.sort().modelQuery;
  }
}

export default QueryBuilder;
