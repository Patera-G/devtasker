<?php

namespace App\Tests\Api;

use Symfony\Component\HttpFoundation\Response;

class ProjectApiTest extends ApiTestCase
{
    public function testGetTasks()
    {
        $client = $this->createAuthenticatedClient();

        $client->request('GET', '/api/projects');

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertIsArray($data['data']);
    }

    public function testListProjectsWithPaginationAndSorting()
    {
        $client = $this->createAuthenticatedClient();

        $client->request('GET', '/api/projects?page=1&limit=5&sort=name&direction=asc');

        $this->assertResponseIsSuccessful();

        $data = json_decode($client->getResponse()->getContent(), true);
        
        $this->assertArrayHasKey('page', $data);
        $this->assertEquals(1, $data['page']);

        $this->assertArrayHasKey('limit', $data);
        $this->assertEquals(5, $data['limit']);

        $this->assertArrayHasKey('total', $data);
        $this->assertIsInt($data['total']);

        $this->assertArrayHasKey('data', $data);
        $this->assertIsArray( $data['data']);
        $this->assertLessThanOrEqual(5, count($data['data']));

        $titles = array_column($data['data'], 'title');
        $sortedTitles = $titles;
        sort($sortedTitles);

        $this->assertEquals($sortedTitles, $titles);
    }

    public function testCreateProjectWithValidData()
    {
        $client = $this->createAuthenticatedClient();

        $client->request('POST', '/api/projects', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'name' => 'New Project',
            'description' => 'Project description',
            'deadline' => '2025-12-31 00:00:00',
        ]));

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertArrayHasKey('id', $data);
        $this->assertEquals('New Project', $data['name']);
        $this->assertEquals('Project description', $data['description']);
    }

    public function testCreateProjectWithInvalidData()
    {
        $client = $this->createAuthenticatedClient();

        $client->request('POST', '/api/projects', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'name' => '', // Invalid if you have @Assert\NotBlank
            'deadline' => 'invalid-date-format', // Invalid date
        ]));

        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertArrayHasKey('violations', $data);
        $this->assertNotEmpty($data['violations']);
    }

}