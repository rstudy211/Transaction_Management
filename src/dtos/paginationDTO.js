
class PaginationDTO {
    constructor({ page, limit, totalCount, data }) {
      this.page = page;
      this.limit = limit;
      this.totalCount = totalCount;
      this.totalPages = Math.ceil(totalCount / limit);
      this.data = data;
    }
  }
  
module.exports = PaginationDTO