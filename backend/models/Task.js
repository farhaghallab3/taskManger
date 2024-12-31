class Task {
  constructor(id, name, date, status, userId) {
    this.id = id;
    this.name = name;
    this.date = date;
    this.status = status;
    this.userId = userId; // Link task to a specific user
  }

}

module.exports = Task;
