<?php

namespace App\Tests\Api;

use Symfony\Component\HttpFoundation\Response;

class TaskApiTest extends ApiTestCase
{
    public function testGetTasks()
    {
        $client = $this->createAuthenticatedClient();

        $client->request('GET', '/api/tasks');

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertIsArray($data['data']);
    }

    public function testCreateTaskWithInvalidData()
    {
        $client = $this->createAuthenticatedClient();

        $client->request('POST', '/api/tasks', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'title' => '', // Invalid (empty)
            'description' => 'Test description',
            'status' => 'open', // Valid
            'priority' => 'high', // Valid
            'dueDate' => '2023-10-01 12:00:00', // Valid format
        ]));

        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertArrayHasKey('violations', $data);
        $this->assertNotEmpty($data['violations']);
    }

    public function testUpdateTaskWithValidData()
    {
        $client = $this->createAuthenticatedClient();

        // Step 1: Create a new task to update
        $client->request('POST', '/api/tasks', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'title' => 'Original Title',
            'description' => 'Original description',
            'status' => 'todo',
            'priority' => 'low',
            'dueDate' => '2025-12-01 10:00:00',
            'projectId' => 2,
        ]));

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $createdTask = json_decode($client->getResponse()->getContent(), true);
        $taskId = $createdTask['id'];

        // Step 2: Update the task
        $client->request('PUT', "/api/tasks/{$taskId}", [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'title' => 'Updated Title',
            'description' => 'Updated description',
            'status' => 'in_progress',
            'priority' => 'high',
            'dueDate' => '2025-12-15 15:30:00',
            'projectId' => 3,
        ]));

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        // Step 3: Check if data was updated
        $updatedTask = json_decode($client->getResponse()->getContent(), true);

        $this->assertEquals('Updated Title', $updatedTask['title']);
        $this->assertEquals('Updated description', $updatedTask['description']);
        $this->assertEquals('in_progress', $updatedTask['status']);
        $this->assertEquals('high', $updatedTask['priority']);
        $this->assertEquals('2025-12-15T15:30:00+00:00', $updatedTask['dueDate']); // Match expected format
    }

    public function testDeleteTask()
    {
        $client = $this->createAuthenticatedClient();

        // Step 1: Create a task
        $client->request('POST', '/api/tasks', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'title' => 'Task to Delete',
            'description' => 'Temporary task for delete test',
            'status' => 'todo',
            'priority' => 'low',
            'dueDate' => '2025-12-01 10:00:00',
            'projectId' => 2,
        ]));

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $task = json_decode($client->getResponse()->getContent(), true);
        $taskId = $task['id'] ?? null;
        $this->assertNotNull($taskId, 'Task ID should not be null');

        // Step 2: Delete the task
        $client->request('DELETE', "/api/tasks/{$taskId}");

        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);

        // Step 3: Ensure task is gone
        $client->request('GET', "/api/tasks/{$taskId}");
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testAccessDeniedWithoutToken()
    {
        $client = static::createClient(); // NO authentication

        // Try accessing a protected endpoint
        $client->request('GET', '/api/tasks');

        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

}