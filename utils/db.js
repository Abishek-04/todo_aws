const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: process.env.AWS_REGION || "ap-south-1" });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "todo";
const PK_VALUE = "TODO"; // Partition Key value for all todos

async function getTodos() {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: {
      ":pk": PK_VALUE,
    },
  });

  try {
    const response = await docClient.send(command);
    return response.Items || [];
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
}

async function addTodo(todo) {
  const item = {
    PK: PK_VALUE,
    SK: `ID#${todo.id}`,
    ...todo,
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  });

  try {
    await docClient.send(command);
  } catch (error) {
    console.error("Error adding todo:", error);
    throw error;
  }
}

async function deleteTodo(id) {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: PK_VALUE,
      SK: `ID#${id}`,
    },
  });

  try {
    await docClient.send(command);
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
}

module.exports = { getTodos, addTodo, deleteTodo };