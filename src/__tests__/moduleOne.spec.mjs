import {
  describe, it, expect,
} from '@jest/globals';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { divide, getPosts } from '../moduleOne.mjs';

describe('divide function', () => {
  it('should divide two numbers correctly', () => {
    expect(divide(10, 2)).toBe(5);
  });

  it('should throw an error when dividing by zero', () => {
    expect(() => divide(10, 0)).toThrow('Error dividing by zero');
  });
});

describe('getPosts function', () => {
  it('should fetch and return posts data', async () => {
    const mock = new MockAdapter(axios); // Configura la instancia mock
    mock.onGet('https://jsonplaceholder.typicode.com/posts').reply(200, [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }]);

    const result = await getPosts();
    expect(result).toEqual([{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }]);
  });

  it('should throw an error when the status code is not 200', async () => {
    const mock = new MockAdapter(axios); // Configura la instancia mock
    mock.onGet('https://jsonplaceholder.typicode.com/posts').reply(500); // Configura la respuesta simulada con un código de estado 500

    await expect(getPosts()).rejects.toThrow('Error fetching posts');
  });

  it('should throw an error when data is not an array', async () => {
    const mock = new MockAdapter(axios); // Configura la instancia mock
    mock.onGet('https://jsonplaceholder.typicode.com/posts').reply(200, {});

    await expect(getPosts()).rejects.toThrow('Data is not an array');
  });

  it('should throw an error when no posts are found', async () => {
    const mock = new MockAdapter(axios); // Configura la instancia mock
    mock.onGet('https://jsonplaceholder.typicode.com/posts').reply(200, []);

    await expect(getPosts()).rejects.toThrow('No posts found');
  });

  it('should throw an error when too many posts are returned', async () => {
    const mock = new MockAdapter(axios); // Configura la instancia mock
    const mockData = new Array(11).fill({ id: 1, title: 'Post 1' });
    mock.onGet('https://jsonplaceholder.typicode.com/posts').reply(200, mockData);

    await expect(getPosts()).rejects.toThrow('Too many posts');
  });
});
