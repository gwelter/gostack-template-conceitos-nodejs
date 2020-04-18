const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { body } = request;
  const newRepository = {
    ...body,
    id: uuid(),
    likes: 0
  }
  repositories.push(newRepository);
  return response.status(201).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const repositoryIndex = findRepositoryIndex(request.params.id);
  if (repositoryIndex >= 0) {
    const repository = repositories[repositoryIndex];
    repositories[repositoryIndex] = {
      ...repository,
      ...request.body,
      id: repository.id,
      likes: repository.likes,
    }
    return response.json(repositories[repositoryIndex]);
  }
  return response.status(400).end();
});

app.delete("/repositories/:id", (request, response) => {
  const repositoryIndex = findRepositoryIndex(request.params.id);
  if (repositoryIndex >= 0) {
    repositories.splice(repositoryIndex, 1);
    return response.status(204).end();
  }
  return response.status(400).end();
});

app.post("/repositories/:id/like", (request, response) => {
  const repositoryIndex = findRepositoryIndex(request.params.id);
  if (repositoryIndex >= 0) {
    repositories[repositoryIndex].likes += 1;
    return response.json(repositories[repositoryIndex]);
  }
  return response.status(400).end();
});

function findRepositoryIndex(id) {
  return repositories.findIndex(repo => repo.id === id)
}

module.exports = app;
